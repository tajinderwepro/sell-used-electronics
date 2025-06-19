import stripe
import asyncio
from fastapi import HTTPException
from app.core.config import settings
from app.models.payment import Payment
from app.models.order import Order
from app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.quote import Quote
from datetime import datetime
stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def pay_seller(self, order_id: int):
        # Fetch the order
        result = await self.db.execute(
            select(Order)
            .options(
                selectinload(Order.quote).selectinload(Quote.user)
            )
            .where(Order.id == order_id)
        )
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        seller = order.quote.user

        # If seller does not have a Stripe account, create one
        if not seller.stripe_account_id:
            try:
                account = await asyncio.to_thread(
                    stripe.Account.create,
                    type="express",
                    country="US",
                    email=seller.email
                )
                seller.stripe_account_id = account.id
                self.db.add(seller)
                await self.db.commit()
            except stripe.error.StripeError as e:
                raise HTTPException(status_code=400, detail=f"Stripe account error: {str(e)}")

        seller_account_id = seller.stripe_account_id
        # seller_account_id = "acct_1RbcwPQIkoJhvidh"
        if not seller_account_id:
            raise HTTPException(status_code=400, detail="Seller Stripe account not set")

        amount_cents = int(float(1) * 10)

        # Run Stripe transfer in a thread
        try:
            transfer = await asyncio.to_thread(
                stripe.Transfer.create,
                amount=amount_cents,
                currency="usd",
                destination=seller_account_id,
                description=f"Payout for order #{order_id}"
            )
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Transfer error: {str(e)}")

        # Save the payment
        payment = Payment(
            order_id=order_id,
            method="stripe",
            status="success",
            user_id=order.quote.user_id,
            transaction_id=transfer.id,
        )
        self.db.add(payment)
        await self.db.commit()

        return {"success": True, "transfer_id": transfer.id}

    async def generate_onboarding_link(self, user_id: int):
        # Fetch user
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Create Stripe account if not already created
        if not user.stripe_account_id:
            try:
                account = await asyncio.to_thread(
                    stripe.Account.create,
                    type="express",
                    country="US",
                    email=user.email,
                )
                user.stripe_account_id = account.id
                self.db.add(user)
                await self.db.commit()
            except stripe.error.StripeError as e:
                raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")

        # Create onboarding link
        try:
            account_link = await asyncio.to_thread(
                stripe.AccountLink.create,
                # account="acct_1RbcwPQIkoJhvidh",
                account=user.stripe_account_id,
                refresh_url= settings.CLIENT_URL + "/stripe/onboarding/refresh",  
                return_url= settings.CLIENT_URL + "/stripe-status",  
                type="account_onboarding"
            )
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Onboarding error: {str(e)}")

        return {"url": account_link.url}

    async def get_connected_account_status(self, stripe_account_id: str):
        try:
            account = await asyncio.to_thread(stripe.Account.retrieve, stripe_account_id)
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=str(e.user_message or str(e)))

        result = await self.db.execute(select(User).where(User.stripe_account_id == stripe_account_id))
        user = result.scalar_one_or_none()

        if user:
            user.charges_enabled = account.charges_enabled
            user.payouts_enabled = account.payouts_enabled
            user.details_submitted = account.details_submitted
            user_status = ("verified" if account.charges_enabled and account.payouts_enabled else "incomplete")
            user.stripe_account_status = user_status
            user.onboarding_completed_at = datetime.utcnow() if account.details_submitted else None

            await self.db.commit()

        return {
   
            "message" : "Account status fetched successfully",
            "success": True,
            "data":{
                "id": account.id,
                "charges_enabled": account.charges_enabled,
                "payouts_enabled": account.payouts_enabled,
                "details_submitted": account.details_submitted,
                "status" : user_status
            }
        }

    @staticmethod
    async def get_payments_list(db: AsyncSession):
        result = await db.execute(select(Payment).options(selectinload(Payment.user)))
        payments = result.scalars().all()
        return {
            "data": [payment.__dict__ for payment in payments],
            "message": "Payments list fetched successfully",
            "success": True
        }


    @staticmethod
    async def get_user_payment_by_id(user_id,db: AsyncSession):
        result = await db.execute(select(Payment).where(Payment.user_id == user_id))
        payments = result.scalars().all()
        return {
            "data": payments,
            "message": "Payments fetched successfully",
            "success": True
        }