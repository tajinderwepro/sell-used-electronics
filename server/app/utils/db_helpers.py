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
    limit: int = 10,
    options: Optional[List[Any]] = None,
    user_id: Optional[int] = None  # ✅ Add this parameter
) -> Dict[str, Any]:
    query = select(model)

    if options:
        for option in options:
            query = query.options(option)

    # Apply search filter
    if search and search_fields:
        term = f"%{search.lower()}%"
        query = query.where(
            or_(*[func.lower(field).like(term) for field in search_fields])
        )

    # ✅ Apply user_id filter
    if user_id is not None and hasattr(model, "user_id"):
        query = query.where(getattr(model, "user_id") == user_id)

    # Total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Sorting
    sort_column = getattr(model, sort_by, None)
    if not sort_column:
        sort_column = getattr(model, "id")
    query = query.order_by(desc(sort_column) if order_by == "desc" else asc(sort_column))

    # Pagination
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
