# app/services/payment_service.py

import stripe
from fastapi import HTTPException
from app.core.config import settings  # your config should have STRIPE_SECRET_KEY

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripePaymentService:
    def __init__(self):
        pass

    def create_payment_intent(self, amount_cents: int, currency: str = "usd", metadata: dict = None) -> dict:
        """
        Create a Stripe PaymentIntent.
        :param amount_cents: Amount in cents (e.g., 999 for $9.99)
        :param currency: Currency code (default is USD)
        :param metadata: Optional dict to attach (like order_id, user_id)
        :return: Stripe PaymentIntent object
        """
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency=currency,
                metadata=metadata or {},
                automatic_payment_methods={"enabled": True}
            )
            return {"success": True, "client_secret": intent.client_secret}
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")

    def verify_webhook_signature(self, payload: bytes, sig_header: str, webhook_secret: str):
        """
        Verify webhook signature and return the event.
        """
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
            return {"success": True, "event": event}
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid Stripe webhook signature.")

    def retrieve_payment_intent(self, intent_id: str):
        """
        Retrieve a payment intent by its ID.
        """
        try:
            intent = stripe.PaymentIntent.retrieve(intent_id)
            return {"success": True, "payment_intent": intent}
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")

