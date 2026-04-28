import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import Navbar from '../components/Navbar';
import './AdminPanel.css';

export default function AdminPanel() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {

      try {
        setLoading(true);
        const response = await client.get('/billing/transactions');
        setTransactions(response.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('Access denied: Admin only');
          setTimeout(() => navigate('/inventory'), 2000);
        } else {
          setError(err.response?.data?.detail || 'Failed to load transactions');
        }
      } finally {
        setLoading(false);
      }
    };


    fetchTransactions();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="admin-panel">
        <h2>📊 Admin Panel - All Transactions</h2>

        {loading && <p className="loading">Loading transactions...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && transactions.length === 0 && (
          <p className="no-data">No transactions yet</p>
        )}

        {!loading && transactions.length > 0 && (
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Total ($)</th>
                  <th>Items</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>#{tx.id}</td>
                    <td className="amount">${tx.total.toFixed(2)}</td>
                    <td className="items-info">
                      {(() => {
                        try {
                          const items = JSON.parse(tx.items);
                          return items.map((item, idx) => (
                            <div key={idx}>
                              {item.product_name} x {item.quantity} (${item.subtotal.toFixed(2)})
                            </div>
                          ));
                        } catch {
                          return 'Invalid data';
                        }
                      })()}
                    </td>
                    <td className="date">{new Date(tx.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Sales</h3>
            <p className="stat-value">
              ${transactions.reduce((sum, tx) => sum + tx.total, 0).toFixed(2)}
            </p>
          </div>
          <div className="stat-card">
            <h3>Total Transactions</h3>
            <p className="stat-value">{transactions.length}</p>
          </div>
        </div>
      </div>
    </>
  );
}
