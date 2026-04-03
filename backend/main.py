from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes import auth, inventory, billing, ai

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Meridian Home & Lifestyle API",
    description="Retail system with inventory, billing, and AI recommendations",
    version="1.0.0"
)

# Add CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(inventory.router)
app.include_router(billing.router)
app.include_router(ai.router)

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Meridian Home & Lifestyle API",
        "docs": "http://localhost:8000/docs",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
