from sqlalchemy.ext.asyncio import AsyncSession
from app.models.quote_history import QuoteHistory

class QuoteHistoryService:

    @staticmethod
    async def store_quote_history(
        user_id: int,
        model_id: int,
        db: AsyncSession  
    ):
        quote_history = QuoteHistory(
            user_id=user_id,
            model_id=model_id
        )

        db.add(quote_history)
        await db.commit()
        await db.refresh(quote_history)

        return {
            "success": True,
            "message": "Quote history added successfully",
            "quote_history": quote_history
        }
