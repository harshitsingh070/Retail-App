from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas import ProductResponse
from models import Product, Inventory
from deps import get_current_user, get_admin_user, get_db

router = APIRouter(prefix="/inventory", tags=["inventory"])

@router.get("/", response_model=List[ProductResponse])
def get_inventory(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get all products with inventory quantities
    Protected: Requires valid JWT token
    """
    products = db.query(Product).all()
    
    if not products:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No products found"
        )
    
    # Enrich products with inventory quantity
    result = []
    for product in products:
        inventory = db.query(Inventory).filter(Inventory.product_id == product.id).first()
        quantity = inventory.quantity if inventory else 0
        
        result.append({
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "category": product.category,
            "quantity": quantity
        })
    
    return result

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get single product with inventory quantity
    Protected: Requires valid JWT token
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    inventory = db.query(Inventory).filter(Inventory.product_id == product_id).first()
    quantity = inventory.quantity if inventory else 0
    
    return {
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "category": product.category,
        "quantity": quantity
    }

@router.post("/", response_model=ProductResponse)
def create_product(product: dict, admin_user = Depends(get_admin_user), db: Session = Depends(get_db)):
    """
    Create new product (admin only)
    Protected: Requires valid JWT token + admin role
    """
    # Create product
    new_product = Product(
        name=product.get("name"),
        price=product.get("price"),
        category=product.get("category")
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    # Create inventory for new product
    new_inventory = Inventory(
        product_id=new_product.id,
        quantity=product.get("quantity", 10),
        store_id=1
    )
    db.add(new_inventory)
    db.commit()
    
    return {
        "id": new_product.id,
        "name": new_product.name,
        "price": new_product.price,
        "category": new_product.category,
        "quantity": new_inventory.quantity
    }
