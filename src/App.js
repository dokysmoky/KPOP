import React, { useState } from 'react';
import './App.css';

function App() {
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    surname: ''
  });

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://88.200.63.148:4200/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      const data = await res.json();
      setMessage(data.message || 'Registration response received');
    } catch (error) {
      setMessage('Registration failed: ' + error.message);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://88.200.63.148:4200/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Login successful! Welcome ' + data.user.name);
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Login failed: ' + error.message);
    }
  };

  return (
    <div className="App">
      <h2>🌸 Register</h2>
      <form onSubmit={handleRegisterSubmit}>
        <input name="username" placeholder="Username" value={registerData.username} onChange={handleRegisterChange} required />
        <input name="password" type="password" placeholder="Password" value={registerData.password} onChange={handleRegisterChange} required />
        <input name="email" type="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} required />
        <input name="name" placeholder="Name" value={registerData.name} onChange={handleRegisterChange} required />
        <input name="surname" placeholder="Surname" value={registerData.surname} onChange={handleRegisterChange} required />
        <button type="submit">Register</button>
      </form>

      <h2>💫 Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <input name="username" placeholder="Username" value={loginData.username} onChange={handleLoginChange} required />
        <input name="password" type="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required />
        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
