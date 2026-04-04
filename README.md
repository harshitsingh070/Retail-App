# Reatil-APP

Full-stack retail system with FastAPI backend, React frontend, JWT authentication, inventory management, billing, and AI recommendations.

---

## ✨ Features

### User Features
- JWT-based authentication
- Browse products with stock levels  
- Shopping cart (localStorage persisted)
- Checkout with automatic inventory deduction
- AI-powered product recommendations
- Role-based access control

### Admin Features
- All user features
- Add/manage products
- View transaction history
- Sales dashboard

---

## 🎯 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+ & npm
- PostgreSQL 13+ (port 5712)

### 1️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
python seed.py
python main.py
```

Backend: **http://localhost:8000**  
API Docs: **http://localhost:8000/docs**

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend: **http://localhost:5173**

### Demo Credentials
- **Admin**: admin / admin123
- **User**: user1 / user123

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login, returns JWT |
| GET | `/inventory/` | List all products |
| POST | `/inventory/` | Create product (admin) |
| POST | `/billing/checkout` | Checkout & deduct stock |
| GET | `/billing/transactions` | View orders (admin) |
| GET | `/ai/recommend?product=Sofa` | Get recommendations |

**All endpoints except `/auth/login` require JWT token:**
```
Authorization: Bearer <token>
```

---

## 🗄️ Database

PostgreSQL (localhost:5712/retail)

**Tables:**
- `users` - Username, password, role
- `products` - Name, price, category
- `inventory` - Product stock levels
- `transactions` - Order history with JSON items

---

## ⚙️ Configuration

### Database (backend/database.py)
```python
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5712/retail"
)
```

Custom connection:
```bash
set DATABASE_URL=postgresql://user:pass@host:5712/retail
```

### Auth (backend/auth.py)
```python
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

### Frontend API (frontend/src/api/client.js)
```javascript
const client = axios.create({
  baseURL: 'http://localhost:8000',
});
```

---

## 🧪 Testing

### Quick Test (Frontend)
1. Go to http://localhost:5173
2. Login with: `admin` / `admin123`
3. Add product to cart
4. Checkout
5. Check if stock decreased

### API Test (Swagger UI)
1. Open http://localhost:8000/docs
2. Click "Login" → Try it out
3. Copy JWT token
4. Click lock icon → Paste token
5. Test endpoints

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Connection refused (5712)** | Start PostgreSQL: `net start postgresql-x64-15` |
| **Database already seeded** | Normal - reuse existing data (run seed.py if needed) |
| **Port 8000 in use** | `netstat -ano \| findstr :8000` then kill process |
| **CORS error frontend** | Check backend is running: `python main.py` |
| **Invalid token error** | Clear localStorage, re-login |

---

## 📁 Project Structure

```
backend/
  ├── main.py              # FastAPI app
  ├── database.py          # PostgreSQL config
  ├── models.py            # ORM models
  ├── auth.py              # JWT & password hashing
  ├── seed.py              # Database seeder
  ├── requirements.txt      # Dependencies
  └── routes/
      ├── auth.py
      ├── inventory.py
      ├── billing.py
      └── ai.py

frontend/
  ├── package.json
  ├── vite.config.js
  └── src/
      ├── App.jsx
      ├── pages/
      │   ├── Login.jsx
      │   ├── Inventory.jsx
      │   ├── Billing.jsx
      │   └── AIRecommendations.jsx
      ├── components/
      │   ├── Navbar.jsx
      │   └── ProtectedRoute.jsx
      └── api/
          └── client.js
```

---

## 🚀 Production Deployment

### 1. Create PostgreSQL Database
```sql
CREATE DATABASE retail;
CREATE USER retail_user WITH PASSWORD 'strong-password';
GRANT ALL PRIVILEGES ON DATABASE retail TO retail_user;
```

### 2. Set Environment
```bash
set DATABASE_URL=postgresql://retail_user:pass@prod-host:5712/retail
set SECRET_KEY=your-production-secret-key
```

### 3. Build & Run
```bash
# Backend
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000

# Frontend
npm run build
# Serve /dist folder with web server
```

---

## 📚 Tech Stack

**Backend:** FastAPI, SQLAlchemy, Pydantic, Python-jose, Passlib (bcrypt)  
**Frontend:** React 18, Vite, React Router v6, Axios  
**Database:** PostgreSQL  

---

## 📄 License

MIT License - Free to use for learning and commercial purposes

---

## 📞 Need Help?

- API docs: http://localhost:8000/docs
- Check logs in terminal
- Verify PostgreSQL running: `netstat -ano | findstr :5712`
- Clear browser cache if issues persist

---

**Status**: ✅ Ready for Testing | Last Updated: April 4, 2026
