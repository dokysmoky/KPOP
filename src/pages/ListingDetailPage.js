import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ListingDetailPage() {
  const { product_id } = useParams();
  const { user, token } = useAuth();

  const [listing, setListing] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch listing with seller info
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

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`http://88.200.63.148:4200/comments/${product_id}`);
        const data = await res.json();
        setComments(data.comments);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    }
    fetchComments();
  }, [product_id]);

  // Post new comment
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
        body: JSON.stringify({ product_id, comment_text: commentText }),
      });
      if (res.ok) {
        setCommentText('');
        // Refresh comments
        const resComments = await fetch(`http://88.200.63.148:4200/comments/${product_id}`);
        const dataComments = await resComments.json();
        setComments(dataComments.comments);
      } else {
        const errData = await res.json();
        alert(`Error posting comment: ${errData.message}`);
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment');
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!listing) return <p>Listing not found</p>;

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '1rem' }}>
      {/* Left: Listing image */}
      <div style={{ flex: '1' }}>
        {listing.photo ? (
          <img src={listing.photo} alt={listing.title} style={{ width: '100%', borderRadius: '8px' }} />
        ) : (
          <div style={{ width: '100%', height: 300, backgroundColor: '#eee' }}>No Image</div>
        )}
      </div>

      {/* Right: Listing details */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        <h1>{listing.title}</h1>
        <p>{listing.description}</p>
        <p><strong>Condition:</strong> {listing.condition}</p>
        <p><strong>Price:</strong> ${listing.price}</p>

        {/* Seller info */}
        <div style={{ marginTop: '1rem', borderTop: '1px solid #ccc', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <SellerInfo sellerId={listing.seller_id} username={listing.username} />
        </div>

        {/* Comments */}
        <div style={{ marginTop: '2rem' }}>
          <h3>Comments</h3>
          {comments.length === 0 && <p>No comments yet.</p>}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {comments.map(c => (
              <li key={c.comment_id} style={{ borderBottom: '1px solid #ddd', padding: '0.5rem 0' }}>
                <b>{c.username}</b> <small style={{ color: '#666' }}>{new Date(c.created_at).toLocaleString()}</small>
                <p>{c.comment_text}</p>
              </li>
            ))}
          </ul>

          {/* Add comment form */}
          {user ? (
            <form onSubmit={handleSubmitComment} style={{ marginTop: '1rem' }}>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                style={{ width: '100%', padding: '0.5rem' }}
              />
              <button type="submit" disabled={!commentText.trim()} style={{ marginTop: '0.5rem' }}>
                Post Comment
              </button>
            </form>
          ) : (
            <p><a href="/login">Login</a> to post comments.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Separate small component to fetch seller profile picture (optional)
function SellerInfo({ sellerId, username }) {
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    async function fetchProfilePic() {
      try {
        const res = await fetch(`http://88.200.63.148:4200/profile-picture/${sellerId}`);
        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          setProfilePic(url);
        }
      } catch (err) {
        // ignore errors, fallback to no picture
      }
    }
    fetchProfilePic();
    // Cleanup URL object
    return () => {
      if (profilePic) URL.revokeObjectURL(profilePic);
    };
  }, [sellerId]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {profilePic ? (
        <img
          src={profilePic}
          alt={`${username} profile`}
          style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: '#bbb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          {username[0].toUpperCase()}
        </div>
      )}
      <span>Seller: <b>{username}</b></span>
    </div>
  );
}

export default ListingDetailPage;
