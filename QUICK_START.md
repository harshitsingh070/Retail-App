# Quick Start Guide

## 🚀 Applications Running

- **Backend API**: http://localhost:8000
- **Frontend App**: http://localhost:5174
- **Swagger Docs**: http://localhost:8000/docs

## 📝 Demo Credentials

```
Admin Account:
  Username: admin
  Password: admin123

Regular User Account:
  Username: user1
  Password: user123
```

## 🎯 Features to Test

### As Regular User (user1/user123)

1. **Login Page**
   - Username/password form
   - JWT token stored automatically
   - Redirects to inventory on success

2. **Inventory Page**
   - View all 5 products (Sofa, Cushion, Table, Lamp, Rug)
   - See prices and categories
   - See stock quantities
   - Add items to cart
   - Cart persists in browser (localStorage)

3. **Billing Page**
   - Review cart items
   - See order total
   - Click "Place Order" to checkout
   - **WATCHES**: Inventory decreases after checkout
   - Receipt shows with transaction ID

4. **AI Recommendations**
   - Type a product name (e.g., "Sofa")
   - Get related products with reasons
   - Reasons show: "Same category" or "Frequently paired"

5. **Navbar**
   - See your username and role
   - See "Recommendations" button (blue highlight)
   - Logout button

### As Admin (admin/admin123)

1. **All User Features** (above)

2. **Add Products** (in Inventory page)
   - Click "+ Add New Product"
   - Fill name, price, category
   - Submit to add to catalog

3. **Admin Panel**
   - View all transactions (orders placed)
   - See each order's items and total
   - Total sales summary
   - Transaction count summary

4. **Navbar**
   - See "📊 Admin Panel" button (blue highlight)
   - Extra access visible

## 🧪 Testing Checklist

```
User Flow:
  [] Login as user1 / user123
  [] View inventory
  [] Add 2-3 items to cart
  [] Go to billing
  [] Review cart
  [] Checkout
  [] See inventory decreased
  [] Try recommendations

Admin Flow:
  [] Login as admin / admin123
  [] View inventory
  [] Add a new product
  [] View admin panel
  [] See transaction history
  [] Verify inventory deduction worked

Restrictions:
  [] Logout
  [] Try accessing /admin without login (redirects to login)
  [] Login as user1
  [] Try accessing /admin (denied)
```

## 🔄 How Inventory Deduction Works

1. User adds items to cart
2. User clicks "Place Order" on billing page
3. Backend checks stock availability
4. **If** sufficient stock:
   - Inventory quantities DECREASE in database
   - Transaction recorded with items
   - Order ID returned
   - Cart cleared
5. **If** insufficient stock:
   - Error message shown
   - Nothing changes
   - Cart remains

## 📊 Sample Flow

1. Initial inventory: Sofa (10), Cushion (10), Table (10), Lamp (10), Rug (10)
2. User1 buys: Sofa (1), Cushion (2)
3. After checkout: Sofa (9), Cushion (8), Table (10), Lamp (10), Rug (10)
4. Admin can see transaction details

## 🛠️ API Endpoints

```
Public (no auth needed):
  POST /auth/login

Protected (JWT required):
  GET  /inventory/           - List all products
  GET  /inventory/{id}      - Get product details
  GET  /ai/recommend?product=Sofa
  POST /billing/checkout    - Buy items

Admin Only (JWT + admin role required):
  POST /inventory/           - Add new product
  GET  /billing/transactions - View all orders
```

## 📱 Responsive Design

- Navbar responsive (tested on the screenshot provided)
- Mobile-friendly layout
- Touch-friendly buttons

## 🐛 Troubleshooting

### "Cannot reach backend (http://localhost:8000)"
- Make sure backend is running: `python main.py` in backend folder
- Check port 8000 is free or kill process using it

### "Port 5173 is in use"
- Frontend will automatically shift to next available port (5174, 5175, etc.)

### "Database already seeded" message
- This is normal - database is already populated with demo data

### "Invalid username or password"
- Use exact credentials: `admin/admin123` or `user1/user123`
- No typos or extra spaces

---

**Ready to test? Open http://localhost:5174 in your browser!** 🎉
