import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Listing from '../components/Listings';
import '../App.css';
import '../components/Header.css';
import { useNavigate } from 'react-router-dom';
import '../components/Listings.css';

function ListingsPage({ onAddToCart }) {
  const { user, token } = useAuth();
  const [listings, setListings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(''); // '' | 'asc' | 'desc'

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

  // Filter listings based on search term
  const filteredListings = listings.filter(listing =>
    (listing.listing_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort filtered listings by price
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (!sortOrder) return 0; // no sorting
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return 0;
  });

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
    <div className="listingpage">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search listings..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Sort dropdown */}
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="search-input"
      >
        <option value="">Sort by Price</option>
        <option value="asc">Low to High</option>
        <option value="desc">High to Low</option>
      </select>

      <div className="listings-container">
        {sortedListings.map((listing) => (
          <Listing
            key={listing.product_id}
            listing={listing}
            user={user}
            isLiked={wishlist.includes(listing.product_id)}
            onToggleLike={toggleLike}
            onAddToCart={onAddToCart}   
            onClick={() => navigate(`/listing/${listing.product_id}`)} 
          />
        ))}
      </div>
    </div>
  );
}

export default ListingsPage;

