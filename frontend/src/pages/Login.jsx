import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await client.post('/auth/login', {
        username,
        password,
      });

      // Store JWT in localStorage
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('username', username);

      // Redirect to inventory
      navigate('/inventory');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Meridian Home & Lifestyle</h1>
        <h2>Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="demo-credentials">
          <h3>Demo Credentials:</h3>
          <p><strong>Admin:</strong> admin / admin123</p>
          <p><strong>User:</strong> user1 / user123</p>
        </div>
      </div>
    </div>
  );
}
