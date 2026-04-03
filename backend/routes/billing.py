from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
import json
from schemas import CheckoutRequest, CheckoutResponse, TransactionResponse, CartItem
from models import Product, Inventory, Transaction
from deps import get_current_user, get_admin_user, get_db

router = APIRouter(prefix="/billing", tags=["billing"])

@router.post("/checkout", response_model=CheckoutResponse)
def checkout(checkout_req: CheckoutRequest, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Checkout endpoint: Process order and deduct inventory
    CRITICAL: Inventory deduction happens here
    Protected: Requires valid JWT token
    
    Flow:
    1. Validate stock for all items
    2. Calculate total price
    3. Update inventory (DEDUCT quantities)
    4. Create transaction record with items JSON
    5. Return success + total
    """
    
    if not checkout_req.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty"
        )
    
    # Step 1: Validate stock for all items
    items_with_prices = []
    total = 0
    
    for item in checkout_req.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {item.product_id} not found"
            )
        
        inventory = db.query(Inventory).filter(Inventory.product_id == item.product_id).first()
        
        if not inventory or inventory.quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {product.name}. Available: {inventory.quantity if inventory else 0}"
            )
        
        # Step 2: Calculate total
        item_total = product.price * item.quantity
        total += item_total
        items_with_prices.append({
            "product_id": item.product_id,
            "product_name": product.name,
            "quantity": item.quantity,
            "price": product.price,
            "subtotal": item_total
        })
    
    # Step 3: Update inventory (DEDUCT quantities) - THIS IS CRITICAL
    try:
        for item in checkout_req.items:
            inventory = db.query(Inventory).filter(Inventory.product_id == item.product_id).first()
            inventory.quantity -= item.quantity
            db.add(inventory)
        
        # Step 4: Create transaction record with items JSON
        transaction = Transaction(
            total=total,
            items=json.dumps(items_with_prices)
        )
        db.add(transaction)
        
        # Commit all changes at once (atomic transaction)
        db.commit()
        db.refresh(transaction)
        
        # Step 5: Return success
        return {
            "total": total,
            "status": "success",
            "transaction_id": transaction.id
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Checkout failed: {str(e)}"
        )

@router.get("/transactions", response_model=List[TransactionResponse])
def get_transactions(admin_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    """
    Get all transactions (admin only)
    Protected: Requires valid JWT token + admin role
    """
    transactions = db.query(Transaction).all()
    
    if not transactions:
        return []
    
    return [
        {
            "id": t.id,
            "total": t.total,
            "items": json.loads(t.items) if isinstance(t.items, str) else t.items,
            "created_at": t.created_at
        }
        for t in transactions
    ]
