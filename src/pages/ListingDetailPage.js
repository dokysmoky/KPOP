import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ListingDetailPage.css';

function ListingDetailPage({onAddToCart}) {
  const { product_id } = useParams();
  const { user, token } = useAuth();

  const [listing, setListing] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    listing_name: '',
    description: '',
    condition: '',
    price: ''
  });
const [showOfferModal, setShowOfferModal] = useState(false);
const [offerPrice, setOfferPrice] = useState('');
const [offerMessage, setOfferMessage] = useState('');




  useEffect(() => {
    if (listing) {
      setEditData({
        listing_name: listing.listing_name,
        description: listing.description,
        condition: listing.condition,
        price: listing.price
      });
    }
  }, [listing]);

  const handleSaveEdit = async () => {
    try {
      const cleanId = String(listing.product_id).replace(/[^\d]/g, '');
      const res = await fetch(`http://88.200.63.148:4200/listing/${cleanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      alert('Listing updated, please go to listings');
      const updated = await res.json();
      setListing(updated.listing);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating listing:', err);
      alert(`Could not update listing: ${err.message}`);
    }
  };

  async function handleDeleteListing() {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`http://88.200.63.148:4200/listing/${product_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Listing deleted.');
        window.location.href = '/';
      } else {
        const errData = await res.json();
        alert(`Error deleting: ${errData.message}`);
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  }

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`http://88.200.63.148:4200/listing/${product_id}`);
        const data = await res.json();
        setListing(data.listing);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setLoading(false);
      }
    }
    fetchListing();
  }, [product_id]);

  useEffect(() => {
    fetchComments();
  }, [product_id]);

  async function fetchComments() {
    try {
      const res = await fetch(`http://88.200.63.148:4200/comments/${product_id}`);
      const data = await res.json();
      setComments(data.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  }

  async function handleSubmitComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await fetch('http://88.200.63.148:4200/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: parseInt(product_id, 10), comment_text: commentText }),
      });
      if (res.ok) {
        setCommentText('');
        await fetchComments();
      } else {
        const errData = await res.json();
        alert(`Error posting comment: ${errData.message}`);
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment');
    }
  }

  async function handleDeleteComment(comment_id) {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch(`http://88.200.63.148:4200/comments/${comment_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchComments();
      } else {
        const errData = await res.json();
        alert(`Error deleting comment: ${errData.message}`);
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment');
    }
  }

  async function handleReport({ productId, commentId = null, reportedUserId }) {
    if (!user) {
      alert('Please login to report.');
      return;
    }
    const reason = prompt('Please enter the reason for reporting (optional):', '');

    try {
      const res = await fetch('http://88.200.63.148:4200/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          comment_id: commentId,
          reported_user_id: reportedUserId,
          report_reason: reason || null,
          user_id: user.id,
        }),
      });
      if (res.ok) {
        alert('You successfully reported it.');
      } else {
        const errData = await res.json();
        alert(`Error reporting: ${errData.message}`);
      }
    } catch (err) {
      console.error('Error reporting:', err);
      alert('Failed to report.');
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!listing) return <p>Listing not found</p>;


async function handleSubmitOffer(e) {
  e.preventDefault();
  if (!offerPrice.trim()) {
    alert('Please enter an offer price.');
    return;
  }
  try {
    const res = await fetch('http://88.200.63.148:4200/offers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        listing_id: listing.product_id,
        seller_id: listing.seller_id,
        offer_price: offerPrice,
        message: offerMessage,
      }),
    });

    if (res.ok) {
      alert('Offer sent successfully!');
      setShowOfferModal(false);
      setOfferPrice('');
      setOfferMessage('');
    } else {
      const errData = await res.json();
      alert(`Error sending offer: ${errData.message}`);
    }
  } catch (err) {
    console.error('Error sending offer:', err);
    alert('Failed to send offer.');
  }
}


  return (
      <div className="backg">
  <div className="listing-detail-container">
    <div className="listing-image">
      {listing.photo ? (
        <img
          src={listing.photo}
          alt={listing.listing_name}
        />
      ) : (
        <div style={{
          width: '100%',
          maxWidth: '300px',
          maxHeight: '300px',
          objectFit: 'cover',
          borderRadius: '8px',
          backgroundColor: '#eee'
        }}>No Image</div>
      )}
    </div>

    <div className="listing-details">
  <div className="listing-header">
    <h1 >{listing.listing_name}</h1>
    <div className="button-group">
      {user && user.id === listing.seller_id && !isEditing && (
        <>
         
          <button className="pretty-button" onClick={() => setIsEditing(true)}>Edit</button>
          <button className="pretty-button red" onClick={handleDeleteListing}>Delete</button>
        </>
      )}
 {user && user.id !== listing.seller_id && (
    <button className="pretty-button green" onClick={() => setShowOfferModal(true)}>
      Make Offer
    </button>
  )}
{user && user.id !== listing.seller_id && (
      <button
        className="pretty-button orange"
        onClick={() => {
          if (onAddToCart) onAddToCart(listing.product_id);
        }}
      >
        <img src="/10.png" alt="Add to cart" class="icon1"  />
      </button>
    )}

      <button
        className="pretty-button orange"
        onClick={() =>
          handleReport({
            productId: Number(product_id.replace(/[^\d]/g, "")),
            reportedUserId: listing.seller_id,
            commentId: null,
          })
        }
      >
        Report Post
      </button>
    </div>
  </div>

  {isEditing ? (
    <div>
      <input type="text" value={editData.listing_name} onChange={e => setEditData({ ...editData, listing_name: e.target.value })} placeholder="Listing name" />
      <textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} placeholder="Description" />
      <input type="text" value={editData.condition} onChange={e => setEditData({ ...editData, condition: e.target.value })} placeholder="Condition" />
      <input type="number" value={editData.price} onChange={e => setEditData({ ...editData, price: e.target.value })} placeholder="Price" />
      <div style={{ marginTop: '0.5rem' }}>
        <button className="pretty-button" onClick={handleSaveEdit}>Save</button>
        <button className="pretty-button orange" onClick={() => setIsEditing(false)} style={{ marginLeft: '0.5rem' }}>Cancel</button>
      </div>
    </div>
  ) : (
    <>
    <div className="deco">
      <p><strong>Description:</strong>{listing.description}</p>
      <p><strong>Condition:</strong> {listing.condition}</p>
      <p><strong>Price:</strong> ${listing.price}</p>
      </div>
    </>
  )}

  <div style={{ marginTop: '1rem', borderTop: '1px solid #ccc', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <SellerInfo sellerId={listing.seller_id} username={listing.username} />
  </div>

      {/* Comments section */}
      <div className="comments-section">
        <h3 style={{ textAlign: 'left' }}>Comments</h3>
        {comments.length === 0 && <p>No comments yet.</p>}
        <ul style={{ listStyle: 'none', padding: 0 }}>
  {comments.map(c => (
    <li key={c.comment_id} className="comment" style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <b>{c.username}</b>{' '}
          <small style={{ color: '#666' }}>
            {new Date(c.comment_date).toLocaleDateString()} {new Date(c.comment_date).toLocaleTimeString()}
          </small>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="pretty-button orange"
            onClick={() =>
              handleReport({
                productId: Number(product_id.replace(/[^\d]/g, "")),
                commentId: c.comment_id,
                reportedUserId: c.user_id,
              })
            }
          >
            Report
          </button>
          {user && (user.id === c.user_id || user.is_admin) && (
            <button className="pretty-button red" onClick={() => handleDeleteComment(c.comment_id)}>Delete</button>
          )}
        </div>
      </div>
      <p style={{ marginTop: '0.25rem' }}>{c.comment_text}</p>
    </li>
  ))}
</ul>


       {user ? (
  <form onSubmit={handleSubmitComment} style={{ marginTop: '1rem', width: '100%' }}>
    <textarea
      value={commentText}
      onChange={e => setCommentText(e.target.value)}
      placeholder="Write a comment..."
      rows={3}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        resize: 'vertical',
        padding: '0.5rem',
        fontSize: '1rem'
      }}
    />
    <button
      type="submit"
      disabled={!commentText.trim()}
      className="pretty-button"
      style={{ marginTop: '0.5rem', display: 'inline-block' }}
    >
      Post Comment
    </button>

  </form>
) : (
  <p><a href="/login">Login</a> to post comments.</p>
)}

      </div>
    </div>

      {showOfferModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Make an Offer</h3>
            <form onSubmit={handleSubmitOffer}>
              <input
                type="number"
                placeholder="Offer price"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                required
                style={{ width: '100%', marginBottom: '0.5rem' }}
              />
              <textarea
                placeholder="Message (optional)"
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                style={{ width: '100%', marginBottom: '0.5rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" className="pretty-button green">Send Offer</button>
                <button type="button" className="pretty-button red" onClick={() => setShowOfferModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}


  </div>
  </div>



);


}

function SellerInfo({ sellerId, username }) {
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    async function fetchProfilePic() {
      try {
        const res = await fetch(`http://88.200.63.148:4200/profile-picture/${sellerId}`);
        if (res.ok) {
          const blob = await res.blob();
          setProfilePic(URL.createObjectURL(blob));
        }
      } catch {}
    }
    fetchProfilePic();
    return () => {
      if (profilePic) URL.revokeObjectURL(profilePic);
    };
  }, [sellerId]);


  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {profilePic ? (
        <img src={profilePic} alt={`${username} profile`} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <div style={{
          width: 50, height: 50, borderRadius: '50%', backgroundColor: '#bbb',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
        }}>
          {username[0].toUpperCase()}
        </div>
      )}
      <span>Seller: <b>{username}</b></span>
    </div>
  );
}

export default ListingDetailPage;
