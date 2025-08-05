import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage({ setUser }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://88.200.63.148:4200/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        navigate('/');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>💫 Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
      {message && <p className="error">{message}</p>}
    </div>
  );
}

export default LoginPage;
