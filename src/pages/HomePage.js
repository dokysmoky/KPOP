import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';
import '../components/Header.css';
import Listings from './Listings';
 

function HomePage() {
  const { user } = useAuth();

  /*return (
    <div>
      <h1>Welcome to the KPOP Photocard Marketplace!</h1>
      {!user && (
        <p>
          Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to interact with listings.
        </p>
      )}
      <Listings />
    </div>
  );
}*/

 return (
    <div className="homepage-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to the KPOP Photocard Marketplace!</h1>
          {!user && (
            <p>
              Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to interact with listings.
            </p>
          )}
        </div>
      </div>

      <div className="listings-section">
        <Listings />
      </div>
    </div>
  );
}

export default HomePage;
