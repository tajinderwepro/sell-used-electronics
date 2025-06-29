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
from app.schemas.payments import PaymentOut
from typing import Optional
from app.utils.db_helpers import paginate_query


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

        # amount_cents = int(order.total_amount * 100) 
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
            error_message = str(e)
            user_friendly_message = "Payout failed due to insufficient funds in your Stripe balance. Please ensure your platform account has enough funds."

            if "insufficient available funds" in error_message.lower():
                user_friendly_message = (
                    "Payout failed: Your Stripe balance does not have enough funds to pay the seller. "
                    "Please collect payment from the buyer first or top up your Stripe account."
                )

            raise HTTPException(
                status_code=400,
                detail={
                    "message": user_friendly_message,
                    "success": False
                    # Optionally include for logging/debugging:
                    # "stripe_error": error_message
                }
            )

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
            if not account.charges_enabled or not account.payouts_enabled:
                raise HTTPException(status_code=400, detail="Seller account not ready to receive payouts")
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
    async def get_payments_list(
        db: AsyncSession,
        search: Optional[str] = None,
        sort_by: str = "id",
        order_by: str = "asc",
        current_page: int = 1,
        limit: int = 10,
        get_all: bool = False,
    ):
        return await paginate_query(
            db=db,
            model=Payment,
            schema=PaymentOut,
            search=search,
            search_fields=[Payment.method, Payment.status, Payment.transaction_id],
            sort_by=sort_by,
            order_by=order_by,
            current_page=current_page,
            limit=None if get_all else limit,
            options=[selectinload(Payment.user)],
            join_models=[User],  
            custom_sort_map={"user_name": User.name} 
        )

    @staticmethod
    async def get_user_payment_by_id(
        db: AsyncSession,
        search: Optional[str] = None,
        sort_by: str = "id",
        order_by: str = "asc",
        current_page: int = 1,
        limit: int = 10,
        get_all: bool = False,
        user_id: Optional[int] = None
    ):
        return await paginate_query(
            db=db,
            model=Payment,
            schema=PaymentOut,
            search=search,
            search_fields=[Payment.method, Payment.status, Payment.transaction_id],
            sort_by=sort_by,
            order_by=order_by,
            current_page=current_page,
            limit=None if get_all else limit,
            options=[selectinload(Payment.user)],
            join_models=[User],  
            custom_sort_map={"user_name": User.name},
            user_id=user_id 
        )
