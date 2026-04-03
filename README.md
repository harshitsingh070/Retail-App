# 🏠 Meridian Home & Lifestyle - Retail Application

A full-stack retail system with FastAPI backend, React frontend, JWT authentication, inventory management, billing system, and AI-powered product recommendations.

## ✨ Key Features

### 🟢 User Features
- ✅ **User Authentication** - JWT-based login with username/password
- ✅ **View Inventory** - Browse all products with prices and stock levels
- ✅ **Shopping Cart** - Add items to cart (persisted in localStorage)
- ✅ **Billing & Checkout** - Order review and checkout with automatic inventory deduction
- ✅ **Product Recommendations** - AI-powered suggestions based on category and cross-sell
- ✅ **Role-Based Access** - Users cannot access admin features

### 🔴 Admin Features
- ✅ **All User Features** - Admins can do everything users can
- ✅ **Add Products** - Create new products with the inventory form
- ✅ **View Transactions** - See all orders from all users
- ✅ **Sales Summary** - Total sales and transaction count dashboard
- ✅ **Admin Panel** - Dedicated admin interface with transaction history

---

## 🏗️ Project Structure

```
Meridian Home & Lifestyle/
┌── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── database.py             # SQLite connection & SQLAlchemy
│   ├── models.py               # ORM models (User, Product, Inventory, Transaction)
│   ├── schemas.py              # Pydantic request/response models
│   ├── auth.py                 # JWT token & password hashing
│   ├── deps.py                 # Dependency injection (get_current_user, get_admin_user)
│   ├── seed.py                 # Database seeding with sample data
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
- SQLite (included with Python)

---

## Backend Setup

### Step 1: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Seed Database

```bash
python seed.py
```

This will:
- Create SQLite database (retail.db)
- Create all tables (users, products, inventory, transactions)
- Seed sample data:
  - 2 demo users (admin, user1)
  - 5 demo products (Sofa, Cushion, Table, Lamp, Rug)
  - Initial inventory: 10 units per product

### Step 3: Run Backend Server

```bash
python main.py
```

Backend will be available at: **http://localhost:8000**

API documentation: **http://localhost:8000/docs** (interactive Swagger UI)

---

## Frontend Setup

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

## 📊 API Endpoints

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

### Database Already Seeded
```
✓ Database already seeded. Skipping...
```
This is normal - database is already populated. To reset:
```bash
rm backend/retail.db
python backend/seed.py
```

### Port Already in Use
- Backend (8000): Kill process on port 8000
  ```bash
  # Windows
  netstat -ano | findstr :8000
  ```
- Frontend (5173): Will automatically use next available port (5174, 5175, etc.)

### Frontend Can't Connect to Backend
```
Error: Failed to fetch / CORS error
```
**Fix**: Make sure backend is running on http://localhost:8000
```bash
cd backend
python main.py
```

### "Invalid token" on Protected Routes
**Fix**: Make sure you're logged in and JWT token is stored in localStorage
- Open DevTools (F12) → Application → Storage → localStorage
- Check if "token" key exists

---

## ✅ Testing Checklist

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

## 🔧 Configuration

### Backend Config (`backend/auth.py`)
```python
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

### Database Config (`backend/database.py`)
```python
# Using SQLite for development
DATABASE_URL = "sqlite:///./retail.db"

# Switch to PostgreSQL for production
# DATABASE_URL = "postgresql://user:password@localhost:5432/retail"
```

### Frontend API (`frontend/src/api/client.js`)
```javascript
const client = axios.create({
  baseURL: 'http://localhost:8000',
});
```

---

## 📚 Project Documentation

- **IMPLEMENTATION_PLAN.md** - Detailed implementation guide
- **FEATURES_IMPLEMENTED.md** - Complete feature breakdown
- **QUICK_START.md** - Quick start guide
- **IMPLEMENTATION_COMPLETE.md** - Technical architecture

---

## 🔒 Security Notes

- JWT tokens expire after 30 minutes
- Passwords are hashed with bcrypt
- All routes require valid JWT (except login)
- Admin routes check role permission
- CORS enabled for frontend communication
- Atomic database transactions prevent partial updates

---

## 📈 Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database
- **Pydantic** - Data validation
- **Python-jose** - JWT handling
- **Passlib & Bcrypt** - Password hashing
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **React Router v6** - Routing
- **Vite** - Build tool
- **Axios** - HTTP client
- **CSS3** - Responsive styling

### Database
- **SQLite** - Development
- **PostgreSQL compatible** - Ready for production

---

## 🚀 Deployment

To deploy to production:

1. **Update environment variables**
   ```bash
   export ALGORITHM=HS256
   export SECRET_KEY=your-production-secret-key
   export DATABASE_URL=postgresql://...
   ```

2. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Run backend**
   ```bash
   cd backend
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```

4. **Serve frontend** from `/dist` folder

---

## 📄 License

MIT License - Feel free to use for learning and commercial purposes.

---

## 👨‍💻 Author

Created as a full-stack retail application prototype

---

**Status**: ✅ Fully Implemented & Ready for Testing

Last Updated: 2026-04-03

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
