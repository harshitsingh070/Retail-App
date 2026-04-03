# Meridian Home & Lifestyle - Retail System

A full-stack retail application with FastAPI backend, React frontend, JWT authentication, inventory management, billing system, and AI-powered product recommendations.

## 🎯 Features

✅ **User Authentication** - JWT-based login with admin/user roles  
✅ **Inventory Management** - View products, track stock quantities  
✅ **Billing System** - Shopping cart, checkout with inventory deduction  
✅ **AI Recommendations** - Category-based product suggestions  
✅ **Role-Based Access Control** - Admin and user permissions  
✅ **Protected Routes** - All endpoints require valid JWT token  

---

## 🏗️ Project Structure

```
Meridian Home & Lifestyle/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── database.py             # PostgreSQL connection & SQLAlchemy
│   ├── models.py               # ORM models (User, Product, Inventory, Transaction)
│   ├── schemas.py              # Pydantic request/response models
│   ├── auth.py                 # JWT token & password hashing
│   ├── deps.py                 # Dependency injection (get_current_user, get_admin_user)
│   ├── seed.sql                # Database setup & sample data
│   ├── requirements.txt         # Python dependencies
│   └── routes/
│       ├── auth.py             # Login & logout endpoints
│       ├── inventory.py        # Product listing & management
│       ├── billing.py          # Checkout & transactions
│       └── ai.py               # Recommendations engine
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main app with routing
│   │   ├── main.jsx            # React entry point
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Login form
│   │   │   ├── Inventory.jsx   # Product listing & cart
│   │   │   ├── Billing.jsx     # Checkout & order summary
│   │   │   └── AIRecommendations.jsx  # Product suggestions
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation & logout
│   │   │   └── ProtectedRoute.jsx    # Auth wrapper
│   │   ├── api/
│   │   │   └── client.js       # Axios with JWT config
│   │   └── [*.css files]       # Styling
│   │
│   ├── package.json            # Node dependencies
│   ├── vite.config.js          # Vite configuration
│   └── index.html              # HTML entry point
│
└── IMPLEMENTATION_PLAN.md      # Full implementation guide
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+ & npm
- PostgreSQL 12+ (running locally)

---

## 1️⃣ Backend Setup

### Step 1: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Create PostgreSQL Database

Open PostgreSQL console and run:

```sql
CREATE DATABASE retail;
```

Then execute the seed script:

```bash
psql -U postgres -d retail -f seed.sql
```

This will:
- Create all tables (users, products, inventory, transactions)
- Seed sample products (Sofa, Cushion, Table, Lamp, Rug)
- Add demo users (admin, user1)

### Step 3: Run Backend Server

```bash
cd backend
uvicorn main:app --reload
```

Backend will be available at: **http://localhost:8000**

API documentation: **http://localhost:8000/docs** (interactive Swagger UI)

---

## 2️⃣ Frontend Setup

### Step 1: Install Node Dependencies

```bash
cd frontend
npm install
```

### Step 2: Run Frontend Development Server

```bash
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## 🔐 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| User | user1 | user123 |

---

## 📋 API Endpoints

### Authentication
- `POST /auth/login` - Login with credentials, returns JWT token
- `POST /auth/logout` - Logout (clear JWT on client)

### Inventory
- `GET /inventory/` - Get all products with stock quantities
- `GET /inventory/{product_id}` - Get single product details
- `POST /inventory/` - Create new product (admin only)

### Billing
- `POST /billing/checkout` - Checkout with inventory deduction
  - Input: `{"items": [{"product_id": 1, "quantity": 2}]}`
  - Returns: `{"total": 1000, "status": "success", "transaction_id": 123}`
- `GET /billing/transactions` - View all transactions (admin only)

### AI Recommendations
- `GET /ai/recommend?product=Sofa` - Get product recommendations
  - Returns: `{"product": "Sofa", "recommendations": [{"name": "Cushion", "reason": "Same category: furniture"}]}`

**All endpoints except `/auth/login` require valid JWT token in Authorization header:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 🧪 Testing the System

### Backend Testing (via FastAPI Docs)

1. Open **http://localhost:8000/docs**
2. **Login**: Click "Try it out" on `POST /auth/login`
   - username: `admin`
   - password: `admin123`
3. **Copy JWT token** from response
4. **Click the lock icon** at top right → paste token
5. **Test endpoints**:
   - GET `/inventory/` → see products
   - GET `/ai/recommend?product=Sofa` → see recommendations
   - POST `/billing/checkout` with items → inventory deducts

### Frontend Testing

1. Open **http://localhost:5173**
2. **Login** with admin/admin123
3. **Inventory page**: See products with stock
4. **Add to cart**: Click "Add to Cart" on products
5. **Billing page**: Review cart and click "Place Order"
   - Stock should decrease in database
6. **Recommendations page**: Select product → see suggestions
7. **Logout**: Click logout button in navbar

---

## 🎯 Key Features Explained

### Inventory Deduction (Critical)
When checkout is called, the backend:
1. Validates stock availability
2. Calculates total price
3. **Updates inventory table** (DEDUCT quantities)
4. Creates transaction record with cart items (JSON)
5. Returns success

**Without inventory deduction, the system is fake.** This is implemented to prove the system works.

### AI Recommendations
Uses 2-rule logic:
1. **Same Category**: If product is furniture, recommend other furniture
2. **Cross-Sell**: Recommend complementary items based on category

Example:
- Sofa (furniture) → Cushion, Lamp, Rug
- Table (furniture) → Chairs, Sofa, Rug

### JWT Authentication
- All routes (except login) require valid JWT token
- Admin users get `role: admin` claim
- Regular users get `role: user` claim
- Dependencies in `deps.py` enforce role-based access

---

## 🐛 Troubleshooting

### PostgreSQL Connection Error
```
Error: could not connect to database "retail"
```
**Fix**: Make sure PostgreSQL is running and database `retail` exists
```bash
psql -U postgres -c "CREATE DATABASE retail;"
```

### Frontend Can't Connect to Backend
```
Error: Failed to fetch / CORS error
```
**Fix**: Make sure backend is running on http://localhost:8000 and CORS is enabled in `main.py`

### "Invalid token" on Protected Routes
**Fix**: Make sure you copied the JWT token from login response and it's in the Authorization header

### Port Already in Use
- Backend (8000): `netstat -ano | findstr :8000` (Windows)
- Frontend (5173): `netstat -ano | findstr :5173` (Windows)

---

## 📝 Demo Script (Testing Checklist)

Use this script to verify all features work:

### ✅ Minimum Working System

1. **Login works**
   - [ ] Go to http://localhost:5173
   - [ ] Login with admin/admin123
   - [ ] JWT stored in localStorage

2. **See Inventory**
   - [ ] Inventory page loads
   - [ ] Products visible (Sofa, Cushion, Table, Lamp, Rug)
   - [ ] Stock quantities shown

3. **Buy Product** (Stock Reduction)
   - [ ] Add Sofa to cart (qty: 2)
   - [ ] Go to billing, checkout
   - [ ] Order succeeds
   - [ ] Check `/billing/transactions` endpoint → items stored
   - [ ] Check database: `SELECT * FROM inventory;` → Sofa qty reduced from 10 to 8

4. **Get Recommendations**
   - [ ] Go to Recommendations page
   - [ ] Type "Sofa"
   - [ ] See recommendations with reasons
   - [ ] "Cushion" shows "Same category: furniture"

---

## 🔧 Environment Variables

Currently using hardcoded values in `auth.py`:
```python
SECRET_KEY = "your-secret-key-change-in-production"
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/retail"
```

To use .env file (optional):
```
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/retail
```

---

## 📦 Building for Production

### Backend
```bash
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend
```bash
npm run build
npm run preview
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user'
);
```

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price FLOAT NOT NULL,
  category VARCHAR(100) NOT NULL
);
```

### Inventory Table
```sql
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 10,
  store_id INT DEFAULT 1,
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE(product_id, store_id)
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  total FLOAT NOT NULL,
  items JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📄 License

MIT License - Feel free to use for learning and commercial purposes.

---

## 🎓 What You'll Learn

- FastAPI backend development
- SQLAlchemy ORM & PostgreSQL
- JWT authentication & role-based access control
- React with Vite & React Router
- Axios HTTP client with interceptors
- Database transactions & atomicity
- Full-stack application architecture

---

## 📞 Support

For issues or questions, check the IMPLEMENTATION_PLAN.md for detailed phase-by-phase breakdown.

---

**Ready to scale?** The system is designed to be extensible:
- Add more products (just seed the database)
- Extend inventory with warehouse locations (using `store_id`)
- Add payment processing (integrate Stripe/PayPal in `/billing/checkout`)
- Implement caching (Redis for product listing)
- Add order tracking & notifications

Good luck! 🚀
#   R e t a i l - A p p  
 