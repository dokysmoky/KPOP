import React from 'react';
import '../App.css';
import './Header.css';
import './Listings.css';

function Listing({ listing, user, isLiked, onToggleLike, onAddToCart, onClick, isWishlistItem = false, onRemoveFromWishlist }) {
  const fallbackImage = '/3.png';

  const imageUrl = listing.photo
    ? listing.photo.startsWith('data:image')
      ? listing.photo
      : `data:image/jpeg;base64,${listing.photo}`
    : fallbackImage;

  return (
    <div className="listing" onClick={onClick} style={{ cursor: 'pointer' }}>
      {imageUrl && (
        <img src={imageUrl} alt={listing.title} className="listing-image" />
      )}

      <h3>{listing.title}</h3>
      <p>{listing.description}</p>

      {user ? (
        <>
          <button
            onClick={e => {
              e.stopPropagation();
              if (onAddToCart) {
                onAddToCart(listing.product_id);
              }
            }}
          >
            Add to Cart
          </button>

          {isWishlistItem ? (
            <button
              onClick={e => {
                e.stopPropagation();
                if (onRemoveFromWishlist) onRemoveFromWishlist();
              }}
              style={{ color: 'red' }}
            >
              Remove from Wishlist
            </button>
          ) : (
            <button
              onClick={e => {
                e.stopPropagation();
                onToggleLike(listing.product_id);
              }}
            >
              {isLiked ? '❤️ Unlike' : '🤍 Like'}
            </button>
          )}
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