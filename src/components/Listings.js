
import React from 'react';
import '../App.css';
import './Header.css';
import './Listings.css';

function Listing({ listing, user }) {
  return (
    <div className="listing">
      <h3>{listing.title}</h3>
      <p>{listing.description}</p>
      {user ? (
        <>
          <button>Add to Cart</button>
          <button>Like</button>
        </>
      ) : (
        <p className="auth-warning">
        <a href="/login">Login</a> or <a href="/register">Register</a> to interact with listings.
      </p>
      )}
    </div>
  );
}

export default Listing;

 