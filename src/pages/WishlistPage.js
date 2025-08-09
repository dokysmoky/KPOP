import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Listing from '../components/Listings';
import '../App.css';

function WishlistPage() {
  const { user, token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
 console.log("WishlistPage mounted");

  useEffect(() => {
    console.log('Current user:', user);
    console.log("Calling fetchWishlist...");
    console.log("Auth token:", token);
console.log("Auth user:", user);

    //if (!token || !user?.user_id) return;
 if (!token || !(user?.id || user?.user_id)) return;

    async function fetchWishlist() {
      try {
        const userId = user.user_id || user.id; 
        console.log("Fetching from:", `http://88.200.63.148:4200/wishlist/${userId}`);
        const response = await fetch(`http://88.200.63.148:4200/wishlist/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        console.log("Fetched wishlist:", data);
        //setWishlist(Array.isArray(data) ? data : []);
        //setWishlist(data.wishlist || data.listings || []);
        //setWishlist(Array.isArray(data) ? data : data.wishlist || []);
        setWishlist(data.wishlist || []);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    }

    fetchWishlist();
  }, [token, user]);

  return (
    <div>
      <h2>Your Wishlist</h2>
      <div className="listings-container">
        {wishlist.length === 0 && <p>Your wishlist is empty.</p>}
        {wishlist.map((listing) => (
          <Listing key={listing.product_id} listing={listing} user={user} />
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;