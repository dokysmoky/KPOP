import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';
import './Header.css';


function Header() {
  const { user, logout } = useAuth();

 return (
    <header className="header">
      <div className="header-title">KPOP Marketplace</div>
      <nav className="header-links">
        <Link to="/">Home</Link>
        <Link to="/listings">Listings</Link>
        {user ? (
          <>
            <span style={{ marginLeft: '1.5rem' }}>Hi, {user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;


