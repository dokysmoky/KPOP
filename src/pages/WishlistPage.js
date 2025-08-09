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

 /*async function handleRemoveFromWishlist(product_id) {
    try {
      const userId = user.user_id || user.id;
      const res = await fetch(`http://88.200.63.148:4200/wishlist/${userId}/${product_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        // Remove item from local state
        setWishlist(prev => prev.filter(item => item.product_id !== product_id));
      } else {
        const errData = await res.json();
        alert(`Failed to remove from wishlist: ${errData.message}`);
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Failed to remove from wishlist');
    }
  }
*/
async function handleRemoveFromWishlist(product_id) {
  if (!token || !user) {
    alert('Please login to modify wishlist');
    return;
  }

  try {
    const res = await fetch('http://88.200.63.148:4200/wishlist', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: user.id || user.user_id,
        product_id,
      }),
    });

    if (res.ok) {
      setWishlist(prev => prev.filter(item => item.product_id !== product_id));
    } else {
      const errData = await res.json();
      alert(`Failed to remove from wishlist: ${errData.message}`);
    }
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    alert('Failed to remove from wishlist');
  }
}


  return (
    <div>
      <h2>Your Wishlist</h2>
      <div className="listings-container">
        {wishlist.length === 0 && <p>Your wishlist is empty.</p>}
        {wishlist.map((listing) => (
          <Listing key={listing.product_id} listing={listing} user={user} isWishlistItem={true}
            onRemoveFromWishlist={() => handleRemoveFromWishlist(listing.product_id)} />
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;