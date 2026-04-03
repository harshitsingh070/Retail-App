import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import Navbar from '../components/Navbar';
import './Billing.css';

export default function Billing() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Cart is empty!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Format cart items for API
      const items = cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const response = await client.post('/billing/checkout', { items });

      setSuccess(true);
      setTransactionId(response.data.transaction_id);

      // Clear cart from localStorage
      localStorage.removeItem('cart');
      setCart([]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container">
        <Navbar />
        <div className="success-message">
          <h2>✓ Order Placed Successfully!</h2>
          <p>Transaction ID: {transactionId}</p>
          <p>Total: ${calculateTotal()}</p>
          <button onClick={() => navigate('/inventory')} className="continue-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar />
      <h1>Billing & Checkout</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="billing-container">
        <div className="cart-review">
          <h2>Order Summary</h2>
          {cart.length > 0 ? (
            <>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.product_name}</td>
                      <td>${item.price}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="total-section">
                <h3>Total: ${calculateTotal()}</h3>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="place-order-btn"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </>
          ) : (
            <p>Your cart is empty. <a href="/inventory">Go back to shopping</a></p>
          )}
        </div>
      </div>
    </div>
  );
}
