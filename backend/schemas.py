from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Auth Schemas
class UserLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str

class UserResponse(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True

# Product Schemas
class ProductCreate(BaseModel):
    name: str
    price: float
    category: str

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    category: str
    quantity: int = None

    class Config:
        from_attributes = True

# Inventory Schemas
class InventoryItem(BaseModel):
    product_id: int
    quantity: int

class InventoryResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    store_id: int

    class Config:
        from_attributes = True

# Billing Schemas
class CartItem(BaseModel):
    product_id: int
    quantity: int

class CheckoutRequest(BaseModel):
    items: List[CartItem]

class CheckoutResponse(BaseModel):
    total: float
    status: str
    transaction_id: int

class TransactionResponse(BaseModel):
    id: int
    total: float
    items: list
    created_at: datetime

    class Config:
        from_attributes = True

# AI Recommendation Schemas
class RecommendationItem(BaseModel):
    name: str
    reason: str

class RecommendationResponse(BaseModel):
    product: str
    recommendations: List[RecommendationItem]
