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
    <div className="Listingpage">
    <div className="listing-card" onClick={onClick}>
      <div className="listing-inner"> {}
        {imageUrl && (
          <img src={imageUrl} alt={listing.title} className="listing-image" />
        )}

        <div className="listing-details">
          <h1>{listing.listing_name}</h1>
          <p>{listing.price} $</p>

          {user ? (
            <div className="listing-actions"> {}
              <button
                className="cart-btn"
                onClick={e => {
                  e.stopPropagation();
                  if (onAddToCart) onAddToCart(listing.product_id);
                }}
              >
                <img src="10.png" alt="Add to wishlist" class="icon1"  />
                </button>             

              {isWishlistItem ? (
                <button
                  className="like-btn"
                  onClick={e => {
                    e.stopPropagation();
                    if (onRemoveFromWishlist) onRemoveFromWishlist();
                  }}
                >
                  Remove from wishlist
                </button>
              ) : (
                <button
                  className="like-btn"
                  onClick={e => {
                    e.stopPropagation();
                    onToggleLike(listing.product_id);
                  }}
                >
                  {isLiked ? <img src="5.png" alt="Add to wishlist" class="icon" /> : <img src="9.png" alt="Remove from wishlist" class="icon" />}
                </button>
              )}
            </div>
          ) : (
            <p className="auth-warning">
              <a href="/login">Login</a> or <a href="/register">Register</a> to interact with listings.
            </p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default Listing;
