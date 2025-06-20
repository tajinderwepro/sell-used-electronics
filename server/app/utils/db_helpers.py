from typing import Optional, Type, List, Union, Dict, Any
from sqlalchemy import select, func, or_, asc, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute
from pydantic import BaseModel
from sqlalchemy import and_

async def paginate_query(
    db: AsyncSession,
    model: Type,
    schema: Type[BaseModel],
    search: Optional[str] = None,
    search_fields: Optional[List[InstrumentedAttribute]] = None,
    sort_by: str = "id",
    order_by: str = "asc",
    current_page: int = 1,
    limit: Optional[int] = 10,
    options: Optional[List[Any]] = None,
    user_id: Optional[int] = None,
    custom_sort_map: Optional[Dict[str, Any]] = None,  # NEW
    join_models: Optional[List[Any]] = None  # NEW (optional joins)
) -> Dict[str, Any]:
    query = select(model)

    # Apply joins if needed
    if join_models:
        for join_model in join_models:
            query = query.join(join_model)

    # Apply selectinload options (for output serialization)
    if options:
        for option in options:
            query = query.options(option)

    # Apply search
    if search and search_fields:
        term = f"%{search.lower()}%"
        query = query.where(
            or_(*[func.lower(field).like(term) for field in search_fields])
        )

    # Filter by user_id if applicable
    if user_id is not None and hasattr(model, "user_id"):
        query = query.where(getattr(model, "user_id") == user_id)

    # Use custom sort if defined
    if custom_sort_map and sort_by in custom_sort_map:
        sort_column = custom_sort_map[sort_by]
    else:
        sort_column = getattr(model, sort_by, getattr(model, "id"))

    query = query.order_by(desc(sort_column) if order_by == "desc" else asc(sort_column))

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Pagination
    if limit is not None:
        query = query.offset((current_page - 1) * limit).limit(limit)

    result = await db.execute(query)
    records = result.scalars().all()

    data = [schema.from_orm(row) for row in records] if schema else records

    return {
        "data": data,
        "total": total,
        "message": "Fetched successfully",
        "success": True
    }
