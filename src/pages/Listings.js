
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Listing from '../components/Listings';
import '../App.css';
import '../components/Header.css';

function ListingsPage() {
  const { user, token } = useAuth(); // get token here too
  const [listings, setListings] = useState([]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch('http://88.200.63.148:4200/listings');
        const data = await response.json();
        console.log('Fetched listings:', data.listings);
        setListings(data.listings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    }
    fetchListings();
  }, []);

  async function handleLike(productId) {
  if (!token || !user) {
    return alert('Please login to like listings');
  }

  try {
    const response = await fetch('http://88.200.63.148:4200/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: user.id,
        product_id: productId
      })
    });

    if (response.ok) {
      alert('Added to wishlist!');
    } else {
      const err = await response.json();
      alert(`Error: ${err.message}`);
    }
  } catch (err) {
    console.error('Like error:', err);
    alert('Error liking listing');
  }
}

  return (
    <div>
      <h2>All Listings</h2>
      <div className="listings-container">
        {listings.map((listing) => (
          <Listing key={listing.product_id} listing={listing} user={user} onLike={handleLike} />
        ))}
      </div>
    </div>
  );
}

export default ListingsPage;