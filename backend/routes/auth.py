from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from datetime import timedelta
from schemas import UserLogin, TokenResponse
from models import User
from auth import hash_password, verify_password, create_token
from database import SessionLocal

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    """
    Login endpoint: Returns JWT token for valid credentials
    Demo credentials:
    - Username: admin, Password: admin123, Role: admin
    - Username: user1, Password: user123, Role: user
    """
    # Query user from database
    db_user = db.query(User).filter(User.username == user.username).first()
    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # For demo purposes, we'll allow hardcoded credentials
    # In production, you'd verify against hashed password in DB
    if user.username == "admin" and user.password == "admin123":
        access_token = create_token(data={"sub": user.username, "role": "admin"})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": "admin"
        }
    elif user.username == "user1" and user.password == "user123":
        access_token = create_token(data={"sub": user.username, "role": "user"})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": "user"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

@router.post("/logout")
def logout():
    """
    Logout endpoint: Clients should delete JWT from localStorage
    Server-side: No session tracking needed (stateless JWT)
    """
    return {"message": "Logged out successfully. Please delete JWT from localStorage."}
