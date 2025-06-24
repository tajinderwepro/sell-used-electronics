# app/routes/auth_routes.py

from fastapi import APIRouter, Depends, Query, HTTPException, status, Request, Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.quote import QuoteListResponse, QuoteOut, QuoteCreate,QuoteUpdate,QuoteStatusUpdate, QuoteResponse, QuoteSingleResponse, QuoteApprove, QuoteListRequest
from app.services.quote_service import QuoteService
from app.services.ebay_service import EbayService
router = APIRouter()

@router.post("/list", response_model=QuoteListResponse)
async def get_list(
    filters: QuoteListRequest = Body(...),
    db: AsyncSession = Depends(get_db)
):
        return await QuoteService.get_all_quotes(
            db=db,
            search=filters.search,
            sort_by=filters.sort_by,
            order_by=filters.order_by,
            current_page=filters.current_page,
            limit=filters.limit
    )

@router.post("/all-list", response_model=QuoteListResponse)
async def get_list(
    filters: QuoteListRequest = Body(...),
    db: AsyncSession = Depends(get_db)
):
        return await QuoteService.get_all_quotes(
            db=db,
            search=filters.search,
            sort_by=filters.sort_by,
            order_by=filters.order_by,
            current_page=filters.current_page,
            limit=filters.limit,
            get_all=True
    )


@router.delete("/{quote_id}", status_code=status.HTTP_200_OK)
async def delete_quote(quote_id: int, db: AsyncSession = Depends(get_db)):
    success = await QuoteService.delete_quote(quote_id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Quote not found")
    return {"message": "Quote deleted successfully", "success": True}

@router.get("/{quote_id}", response_model=QuoteSingleResponse)
async def get_quote(quote_id: int, db: AsyncSession = Depends(get_db)):
    response = await QuoteService.get_quote_by_id(quote_id, db)
    if not response:
        raise HTTPException(status_code=404, detail="Quote not found")
    return response

@router.put("/{quote_id}", response_model=QuoteOut)
async def update_quote(
    quote_id: int,
    quote_in: QuoteUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated_quote = await QuoteService.update_quote(quote_id, quote_in, db)
    if not updated_quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return updated_quote
    
@router.post("/estimate-price")
async def estimate_price(request: Request):
    # CLIENT_ID = "YOUR_CLIENT_ID"
    # CLIENT_SECRET = "YOUR_CLIENT_SECRET"

    # ebayService = EbayService(CLIENT_ID, CLIENT_SECRET)
    # estimated_price = ebayService.get_estimated_price("iPhone 13 Pro Max")
    data = await request.json()
    base_price = data.get("base_price")
    
    if base_price is None:
        return {"error": "base_price is required"}
    
    estimated_price = base_price - ((base_price * 10) / 100)
    return {"estimated_price": estimated_price}

@router.put("/status/{quote_id}", response_model=QuoteApprove)
async def update_quote_status(
    quote_id: int,
    status_in: QuoteStatusUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated_quote = await QuoteService.update_status(quote_id,status_in.user_id, status_in.status, db)
    if not updated_quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return updated_quote

    