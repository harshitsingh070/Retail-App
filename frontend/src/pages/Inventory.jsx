import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import Navbar from '../components/Navbar';
import './Inventory.css';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: '' });
  const [adding, setAdding] = useState(false);
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await client.get('/inventory/');
        setProducts(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const addToCart = (product) => {
    if (product.quantity <= 0) {
      alert('Out of stock!');
      return;
    }

    const existingItem = cart.find((item) => item.product_id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: 1,
      });
    }

    setCart([...cart]);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill all fields');
      return;
    }

    try {
      setAdding(true);
      await client.post('/inventory/', {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
      });
      
      alert('Product added successfully!');
      setFormData({ name: '', price: '', category: '' });
      setShowAddForm(false);
      
      // Refresh inventory
      const response = await client.get('/inventory/');
      setProducts(response.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add product');
    } finally {
      setAdding(false);
    }
  };

  const goToCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    navigate('/billing');
  };

  if (loading) return <div className="container"><Navbar /><p>Loading inventory...</p></div>;
  if (error) return <div className="container"><Navbar /><p className="error">{error}</p></div>;

  return (
    <div className="container">
      <Navbar />
      <h1>Inventory</h1>
      <p className="subtitle">Select products to add to your cart</p>

      {/* Admin: Add Product Form */}
      {role === 'admin' && (
        <div className="admin-section">
          <button onClick={() => setShowAddForm(!showAddForm)} className="toggle-form-btn">
            {showAddForm ? '✕ Close' : '+ Add New Product'}
          </button>
          
          {showAddForm && (
            <form onSubmit={handleAddProduct} className="add-product-form">
              <h3>Add New Product</h3>
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Price ($)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                step="0.01"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
              <button type="submit" disabled={adding} className="submit-btn">
                {adding ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="inventory-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <p className="category">Category: {product.category}</p>
            <p className={`quantity ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
              Stock: {product.quantity}
            </p>
            <button
              onClick={() => addToCart(product)}
              disabled={product.quantity <= 0}
              className="add-to-cart-btn"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Cart ({cart.length} items)</h2>
        {cart.length > 0 && (
          <>
            <ul>
              {cart.map((item, idx) => (
                <li key={idx}>
                  {item.product_name} x {item.quantity} @ ${item.price}
                </li>
              ))}
            </ul>
            <button onClick={goToCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>
          </>
        )}
        {cart.length === 0 && <p>Your cart is empty</p>}
      </div>
    </div>
  );
}
