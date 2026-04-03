"""
Seed script to populate the database with initial data
Works with both SQLite and PostgreSQL
"""

from database import engine, SessionLocal, Base
from models import User, Product, Inventory
import hashlib

def simple_hash(password):
    """Simple password hash for demo purposes"""
    return hashlib.sha256(password.encode()).hexdigest()

# Create tables
Base.metadata.create_all(bind=engine)

# Get database session
db = SessionLocal()

try:
    # Check if data already exists
    existing_users = db.query(User).count()
    if existing_users > 0:
        print("✓ Database already seeded. Skipping...")
        db.close()
        exit(0)
    
    print("🌱 Seeding database...")
    
    # Seed users (demo: admin/admin123, user1/user123)
    admin_user = User(
        username="admin",
        password=simple_hash("admin123"),
        role="admin"
    )
    user1 = User(
        username="user1",
        password=simple_hash("user123"),
        role="user"
    )
    db.add(admin_user)
    db.add(user1)
    db.commit()
    print("✓ Users created")
    
    # Seed products
    products_data = [
        {"name": "Sofa", "price": 500, "category": "furniture"},
        {"name": "Cushion", "price": 50, "category": "furniture"},
        {"name": "Table", "price": 300, "category": "furniture"},
        {"name": "Lamp", "price": 150, "category": "home decor"},
        {"name": "Rug", "price": 200, "category": "home decor"},
    ]
    
    products = []
    for p in products_data:
        product = Product(
            name=p["name"],
            price=p["price"],
            category=p["category"]
        )
        db.add(product)
        products.append(product)
    
    db.commit()
    print("✓ Products created")
    
    # Seed inventory
    for product in products:
        inventory = Inventory(
            product_id=product.id,
            quantity=10,
            store_id=1
        )
        db.add(inventory)
    
    db.commit()
    print("✓ Inventory created")
    
    print("\n✅ Database seeded successfully!\n")
    print("Demo credentials:")
    print("  Admin: admin / admin123")
    print("  User: user1 / user123")
    
except Exception as e:
    print(f"❌ Error seeding database: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()
