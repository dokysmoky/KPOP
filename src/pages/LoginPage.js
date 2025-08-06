import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import '../App.css';
import '../components/Header.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');

  try {
    const res = await fetch('http://88.200.63.148:4200/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (res.ok) {
      login(data.user, data.token);  // <-- pass token too
      navigate('/');
    } else {
      setMessage(data.message || 'Login failed');
    }
  } catch (err) {
    setMessage('Network error: ' + err.message);
  }
};


  return (
    <div className="App centered">
      <div className="auth-form">
        <h2>💫 Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        {message && <p className="error">{message}</p>}
      </div>
    </div>
  );
}
