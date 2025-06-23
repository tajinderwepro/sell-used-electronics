from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.quote import Quote
from app.models.model import Model
from app.models.brand import Brand
from app.models.user import User
from app.models.media import Media
from app.models.category import Category
from app.schemas.quote import QuoteCreate, QuoteUpdate, QuoteOut
from sqlalchemy.orm import selectinload
from sqlalchemy import cast, Integer
from sqlalchemy.orm import joinedload
from typing import Optional, List,Generic, TypeVar
from app.utils.db_helpers import paginate_query
from app.services.risk_detection_service import RiskDetectionService
from fastapi import Request
from app.services.quote_history_service import QuoteHistoryService

class QuoteService:

    @staticmethod
    async def get_all_quotes(
        db: AsyncSession,
        search: Optional[str] = None,
        sort_by: str = "name",
        order_by: str = "asc",
        current_page: int = 1,
        limit: int = 10,
        get_all: bool = False
    ):
        return await paginate_query(
            db=db,
            model=Quote,
            schema=QuoteOut,
            search=search,
            search_fields=[Quote.category],
            sort_by=sort_by,
            order_by=order_by,
            current_page=current_page,
            limit=None if get_all else limit,  
            join_models=[User],  
            custom_sort_map={"user_name": User.name},
            options=[
                selectinload(Quote.category),
                selectinload(Quote.brand),
                selectinload(Quote.model),
                selectinload(Quote.user),
                selectinload(Quote.media)
            ]
        )

    @staticmethod
    async def submit_quote(
        user_id: int,
        quote_in: QuoteCreate,
        image_urls: list[str],
        db: AsyncSession,
        request: Request
    ):
        category_name = None
        brand_name = None
        model_name = None
        try:
            category_id = int(quote_in.category)
            category_result = await db.execute(select(Category).where(Category.id == category_id))
            category_obj = category_result.scalar_one_or_none()
            if category_obj:
                category_name = category_obj.name
        except (ValueError, TypeError):
            category_id = None

        try:
            brand_id = int(quote_in.brand)
            brand_result = await db.execute(select(Brand).where(Brand.id == brand_id))
            brand_obj = brand_result.scalar_one_or_none()
            if brand_obj:
                brand_name = brand_obj.name
        except (ValueError, TypeError):
            brand_id = None

        try:
            model_id = int(quote_in.model)
            model_result = await db.execute(select(Model).where(Model.id == model_id))
            model_obj = model_result.scalar_one_or_none()
            if model_obj:
                model_name = model_obj.name
        except (ValueError, TypeError):
            model_id = None

        risk_service = RiskDetectionService(user_id=user_id,model_id=model_id, request=request, db=db)
        risk_score = await risk_service.calculate_risk_score()

        quote = Quote(
            condition=quote_in.condition,
            offered_price=quote_in.offered_price,
            model_name=model_name,
            brand_name=brand_name,
            category_name=category_name,
            category_id=category_id,
            brand_id=brand_id,
            model_id=model_id,
            user_id=user_id,
            risk_score=risk_score,
            imei=quote_in.imei,
            specifications=", ".join(quote_in.specifications["value"])
            if isinstance(quote_in.specifications, dict) and isinstance(quote_in.specifications["value"], list)
            else str(quote_in.specifications)
        )

        db.add(quote)
        await db.commit()
        await db.refresh(quote)

        await QuoteHistoryService.store_quote_history(user_id=quote.user_id,model_id=quote.model_id,db=db)

        # handle multiple images
        media_objs = []
        for url in image_urls:
            media = Media(
                path=url,
                mediable_type="quote",
                mediable_id=quote.id
            )
            db.add(media)
            media_objs.append(media)
        await db.commit()

        return {
            "success": True,
            "message": "Submit successfully",
        }

    @staticmethod
    async def delete_quote(quote_id: int, db: AsyncSession):
        result = await db.execute(select(Quote).where(Quote.id == quote_id))
        quote = result.scalar_one_or_none()

        if not quote:
            return False

        await db.delete(quote)
        await db.commit()
        return True

    @staticmethod
    async def get_quote_by_id(quote_id: int, db: AsyncSession):
        result = await db.execute(
            select(Quote)
            .options(
                selectinload(Quote.category),
                selectinload(Quote.brand),
                selectinload(Quote.model),
                selectinload(Quote.media),
                selectinload(Quote.user),
            )
            .where(Quote.id == quote_id)
        )
        quote = result.scalar_one_or_none()  # ✅ fetch a single object

        if not quote:
            return None

        return {
            "success": True,
            "message": "Quote fetched successfully",
            "data": QuoteOut.model_validate(quote, from_attributes=True),  # ✅ correct usage
        }

    @staticmethod
    async def update_quote(quote_id: int, quote_in: QuoteUpdate, db: AsyncSession):
        result = await db.execute(select(Quote).where(Quote.id == quote_id))
        quote = result.scalar_one_or_none()

        if not quote:
            return None

        for field, value in quote_in.dict(exclude_unset=True).items():
            setattr(quote, field, value)

        await db.commit()
        await db.refresh(quote)
        result = await db.execute(
            select(Quote)
            .options(
                selectinload(Quote.category_rel),
                selectinload(Quote.brand),
                selectinload(Quote.model)
            )
            .where(Quote.id == quote.id)
        )
        quote = result.scalar_one()
        return quote

    @staticmethod
    async def update_status(quote_id: int, user_id: int, status: str, db: AsyncSession):
        result = await db.execute(
            select(Quote).where(Quote.id == quote_id)
        )
        quote = result.scalar_one_or_none()

        if not quote:
            return None

        quote.status = status
        await db.commit()
        await db.refresh(quote)
        return {
            "success": True,
            "message": "Updated successfully",
        }

    @staticmethod
    async def get_quote(quote_id: int,db: AsyncSession):
        result = await db.execute(
            select(Quote).where(Quote.user_id == quote_id)
        )
        quote = result.scalars().all()

        if not quote:
            return None

        await db.commit()
        return {
        "success": True,
        "message": "Quote fetched successfully",
        "data": quote,
        }
    
    