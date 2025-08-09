
/*import React, { useEffect, useState } from 'react';
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

export default ListingsPage;*/
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Listing from '../components/Listings';
import '../App.css';
import '../components/Header.css';
import { useNavigate } from 'react-router-dom';

function ListingsPage() {
  const { user, token } = useAuth();
  const [listings, setListings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // Fetch all listings
  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch('http://88.200.63.148:4200/listings');
        const data = await response.json();
        setListings(data.listings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    }
    fetchListings();
  }, []);

  // Fetch wishlist for logged in user
  useEffect(() => {
    if (user && token) {
      fetch(`http://88.200.63.148:4200/wishlist/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setWishlist(data.wishlist.map(item => item.product_id));
        })
        .catch(err => console.error('Error fetching wishlist:', err));
    }
  }, [user, token]);

  async function toggleLike(productId) {
    if (!token || !user) {
      return alert('Please login to like listings');
    }

    const isLiked = wishlist.includes(productId);

    try {
      const url = 'http://88.200.63.148:4200/wishlist';
      const options = {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          product_id: productId
        })
      };

      const response = await fetch(url, options);

      if (response.ok) {
        setWishlist(prev =>
          isLiked
            ? prev.filter(id => id !== productId)
            : [...prev, productId]
        );
      } else {
        const err = await response.json();
        alert(`Error: ${err.message}`);
      }
    } catch (err) {
      console.error('Toggle like error:', err);
      alert('Error updating wishlist');
    }
  }

  return (
    <div>
      <h2>All Listings</h2>
      <div className="listings-container">
        {listings.map((listing) => (
          <Listing
            key={listing.product_id}
            listing={listing}
            user={user}
            isLiked={wishlist.includes(listing.product_id)}
            onToggleLike={toggleLike}
            onClick={() => navigate(`/listing/${listing.product_id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default ListingsPage;
