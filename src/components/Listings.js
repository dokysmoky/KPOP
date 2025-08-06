import React from 'react';
import '../App.css';
import './Header.css';
import './Listings.css';

function Listing({ listing, user }) {

  const fallbackImage = '/public/3.png';  
const imageUrl = listing.photo
  ? listing.photo.startsWith('data:image')
    ? listing.photo
    : `data:image/jpeg;base64,${listing.photo}`
  : fallbackImage;

  return (
    <div className="listing">
     {imageUrl && (
  <img src={imageUrl} alt={listing.title} className="listing-image" />
)}

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
