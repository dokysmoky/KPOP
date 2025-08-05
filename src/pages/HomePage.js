import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';
import '../components/Header.css';

function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome to the KPOP Photocard Marketplace!</h1>
      {!user && (
        <p>
          Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to interact with listings.
        </p>
      )}
      <p>
        <Link to="/listings">Browse all listings</Link>
      </p>
    </div>
  );
}

export default HomePage;
