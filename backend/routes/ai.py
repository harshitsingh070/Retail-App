from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas import RecommendationResponse, RecommendationItem
from models import Product, Inventory
from deps import get_current_user, get_db

router = APIRouter(prefix="/ai", tags=["ai"])

# Cross-sell mapping (minimal hardcoding, by category)
CROSS_SELL_MAP = {
    "furniture": ["Cushion", "Rug", "Lamp"],
    "home decor": ["Table", "Sofa", "Rug"]
}

@router.get("/recommend", response_model=RecommendationResponse)
def recommend(product: str, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    AI Recommendations endpoint: Return relevant products with reasons
    
    Logic:
    1. Get product from DB (by name)
    2. Rule 1: Find products in same category
    3. Rule 2: Find cross-sell items based on category
    4. Return recommendations with reasons
    
    Protected: Requires valid JWT token
    """
    
    # Step 1: Get product from DB by name
    db_product = db.query(Product).filter(Product.name.ilike(product)).first()
    
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{product}' not found"
        )
    
    recommendations = []
    seen_products = {db_product.id}  # Avoid recommending the same product
    
    # Step 2: Rule 1 - Same category products
    same_category_products = db.query(Product).filter(
        Product.category == db_product.category,
        Product.id != db_product.id
    ).limit(3).all()
    
    for rec_product in same_category_products:
        if rec_product.id not in seen_products:
            recommendations.append(
                RecommendationItem(
                    name=rec_product.name,
                    reason=f"Same category: {db_product.category}"
                )
            )
            seen_products.add(rec_product.id)
    
    # Step 3: Rule 2 - Cross-sell items based on category
    cross_sell_names = CROSS_SELL_MAP.get(db_product.category, [])
    
    for cross_sell_name in cross_sell_names:
        cross_sell_product = db.query(Product).filter(
            Product.name.ilike(cross_sell_name)
        ).first()
        
        if cross_sell_product and cross_sell_product.id not in seen_products:
            recommendations.append(
                RecommendationItem(
                    name=cross_sell_product.name,
                    reason=f"Frequently paired with {db_product.category} items"
                )
            )
            seen_products.add(cross_sell_product.id)
    
    # Step 4: Return response
    return RecommendationResponse(
        product=db_product.name,
        recommendations=recommendations[:5]  # Limit to 5 recommendations
    )
