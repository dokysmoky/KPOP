import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';
import '../components/Header.css';


function RegisterPage() {
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '', email: '', name: '', surname: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://88.200.63.148:4200/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        navigate('/');
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="App centered">
    <div className="auth-form">
      <h2>🌸 Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="surname" placeholder="Surname" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Sign in here</Link></p>
      {message && <p className="error">{message}</p>}
    </div>
    </div>
  );
}

export default RegisterPage;
