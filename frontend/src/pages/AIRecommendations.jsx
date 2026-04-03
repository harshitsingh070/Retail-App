import React, { useState, useEffect } from 'react';
import client from '../api/client';
import Navbar from '../components/Navbar';
import './AIRecommendations.css';

export default function AIRecommendations() {
  const [productName, setProductName] = useState('Sofa');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch recommendations on component mount
  useEffect(() => {
    fetchRecommendations('Sofa');
  }, []);

  const fetchRecommendations = async (product) => {
    setLoading(true);
    setError('');

    try {
      const response = await client.get(`/ai/recommend?product=${product}`);
      setRecommendations(response.data.recommendations);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (productName.trim()) {
      fetchRecommendations(productName);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <h1>AI Recommendations</h1>
      <p className="subtitle">Find products that go well together</p>

      <div className="recommendations-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Find Recommendations'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {loading && <p className="loading">Loading recommendations...</p>}

        {!loading && recommendations.length > 0 && (
          <div className="recommendations">
            <h2>Recommended for: <strong>{productName}</strong></h2>
            <div className="recommendations-grid">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="recommendation-card">
                  <h3>{rec.name}</h3>
                  <p className="reason">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && recommendations.length === 0 && productName && !error && (
          <p className="no-recommendations">No recommendations found for "{productName}"</p>
        )}
      </div>
    </div>
  );
}
