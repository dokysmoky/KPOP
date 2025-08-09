/*import React from 'react'; 
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
        <Link to="/create-listing">Create Listing</Link>
        {user ? (
          <>
            <Link to="/profile" className="profile-link">
              <img
                src={`http://88.200.63.148:4200/profile-picture/${user.id}`}
                alt="Profile"
                className="header-profile-pic"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/7915522.png'; // fallback image
                }}
              />
            </Link>
            <span style={{ marginLeft: '0.5rem' }}>Hi, {user.username}</span>
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

export default Header;*/
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
        <Link to="/create-listing">Create Listing</Link>
         {user && <Link to="/wishlist">Wishlist</Link>}
          {user && <Link to="/cart">Cart</Link>}

        {user ? (
          <>
            <Link to="/profile" className="profile-link">
              <img
                src={`http://88.200.63.148:4200/profile-picture/${user.id}`}
                alt={`${user.username}'s Profile Picture`}
                className="header-profile-pic"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/7915522.png'; // fallback image in /public folder
                }}
              />
            </Link>
            <span style={{ marginLeft: '0.5rem' }}>Hi, {user.username}</span>
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


