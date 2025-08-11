import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../App.css';
import '../components/Header.css';
import './ProfilePages.css'; 
import '../components/Listings.css';
import { useNavigate } from 'react-router-dom';


export default function ProfilePage() {
  const { user, token, setUser } = useAuth();
  const [age, setAge] = useState(user?.age || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
 const [myListings, setMyListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [errorListings, setErrorListings] = useState(null);
const navigate = useNavigate();

const [myOffers, setMyOffers] = useState([]);
const [loadingOffers, setLoadingOffers] = useState(false);
const [errorOffers, setErrorOffers] = useState(null);
const [myBuyerOffers, setMyBuyerOffers] = useState([]);
const [loadingBuyerOffers, setLoadingBuyerOffers] = useState(false);
const [errorBuyerOffers, setErrorBuyerOffers] = useState(null);

useEffect(() => {
    if (user?.id && token) {
      setLoadingBuyerOffers(true);
      axios.get(`http://88.200.63.148:4200/offers/buyer/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setMyBuyerOffers(response.data.offers || []);
        setErrorBuyerOffers(null);
      })
      .catch(err => {
        console.error('Error fetching buyer offers:', err);
        setErrorBuyerOffers('Failed to load your offers');
      })
      .finally(() => setLoadingBuyerOffers(false));
    }
  }, [user, token]);

async function handleUpdateOfferStatus(offerId, newStatus) {
    try {
      await axios.put(
        `http://88.200.63.148:4200/offers/${offerId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh seller offers
      const sellerRes = await axios.get(`http://88.200.63.148:4200/offers/seller/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyOffers(sellerRes.data.offers || []);
    } catch (err) {
      console.error(`Failed to update offer status: ${newStatus}`, err);
      alert(`Failed to ${newStatus} offer`);
    }
  }



useEffect(() => {
  if (user?.id && token) {
    setLoadingOffers(true);
    axios.get(`http://88.200.63.148:4200/offers/seller/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setMyOffers(response.data.offers || []);
      setErrorOffers(null);
    })
    .catch(err => {
      console.error('Error fetching offers:', err);
      setErrorOffers('Failed to load offers');
    })
    .finally(() => setLoadingOffers(false));
  }
}, [user, token]);


useEffect(() => {
    if (user?.id && token) {
      setLoadingListings(true);
      axios.get(`http://88.200.63.148:4200/listings/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setMyListings(response.data.listings || []);
        setErrorListings(null);
      })
      .catch(err => {
        console.error('Error fetching user listings:', err);
        setErrorListings('Failed to load your listings');
      })
      .finally(() => setLoadingListings(false));
    }
  }, [user, token]);


  useEffect(() => {
    if (!profilePicture) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(profilePicture);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profilePicture]);

  const bufferToBase64 = (buffer) => {
    if (!buffer) return null;
    const binary = new Uint8Array(buffer.data).reduce(
      (acc, b) => acc + String.fromCharCode(b),
      ''
    );
    return window.btoa(binary);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id || !token) {
      alert('You must be logged in to update your profile.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('age', age);
      formData.append('bio', bio);
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      const response = await axios.put(
        `http://88.200.63.148:4200/profile/${user.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data || {};
      let profile_picture_url = null;
      if (updatedUser.profile_picture && updatedUser.profile_picture.data) {
        profile_picture_url = `data:image/jpeg;base64,${bufferToBase64(updatedUser.profile_picture)}`;
      }

      const userToStore = {
  ...user,
  id: user.id || updatedUser.id || updatedUser.user_id, // keep ID safe
  age: updatedUser.age,
  bio: updatedUser.bio,
  ...(profile_picture_url && { profile_picture_url }),
};


      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
      setProfilePicture(null);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/background.gif")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '250vh',
        position: 'relative',
        paddingTop: '60px',
      paddingBottom: '60px',
      }}
    >



<div className="overlay-image-wrapper">
    <img src="/5-star.png" alt="Centered Overlay" className="overlay-image" />
  </div>
  
    <div className="profile-container">
      <div className="profile-box">
        <h2 className="profile-title">My Profile</h2>

        <div className="profile-picture-container">
          <img
            src={previewUrl ||  `http://88.200.63.148:4200/profile-picture/${user?.id}` || '/7915522.png'}
            alt="Profile"
            className="profile-picture"
          />
        </div>

       <div className="profile-info">
  <div className="info-box"><strong>Username:</strong> {user?.username}</div>
  <div className="info-box"><strong>Name:</strong> {user?.name}</div>
  <div className="info-box"><strong>Surname:</strong> {user?.surname}</div>
  <div className="info-box"><strong>Email:</strong> {user?.email}</div>
</div>

        <form onSubmit={handleSubmit} className="profile-form">
          <label>
            Bio:
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </label>

          <label>
            Age:
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="0"
            />
          </label>

          <label>
            Change Profile Picture:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
          </label>

          <button type="submit" className="save-button">Update profile</button>
        </form>
        </div>
      </div>

<div className="my-listings-section">
        <h2>My Listings</h2>
        {loadingListings && <p>Loading your listings...</p>}
        {errorListings && <p style={{ color: 'red' }}>{errorListings}</p>}
        {myListings.length === 0 && !loadingListings && <p>You have no listings yet.</p>}
<div className="listings-grid">
  {myListings.map(listing => (
   <div
  key={listing.product_id}
  className="listing-card"
  onClick={() => navigate(`/listing/${listing.product_id}`)}
  style={{ cursor: 'pointer' }}
>
  <div className="listing-inner">
    {listing.photo ? (
      <img
        src={listing.photo}
        alt={listing.listing_name || 'Listing photo'}
        className="listing-image"
      />
    ) : (
      <div className="no-photo">No photo</div>
    )}

    <div className="listing-details">
      <h1>{listing.listing_name || 'Untitled'}</h1>
      <p>{listing.description?.slice(0, 100)}...</p>
    </div>
  </div>
</div>

  ))}
</div>

      </div>

{/* Offers on Your Listings (Seller) */}
<div className="my-offers-section" style={{ marginTop: '2rem' }}>
  <div className="section-title-box">
  <h2>Offers on Your Listings</h2>
</div>

  {loadingOffers && <p className="loading-text">Loading offers...</p>}
  {errorOffers && <p className="error-text">{errorOffers}</p>}
  {!loadingOffers && myOffers.length === 0 && <p className="empty-text">No offers received yet.</p>}

  <div className="offers-list">
    {myOffers.map(offer => (
      <div key={offer.offer_id} className="offer-card">
        <p><strong>Listing:</strong> {offer.listing_name || 'Unknown'}</p>
        <p><strong>Offer Price:</strong> ${offer.offer_price}</p>
        <p><strong>From:</strong> {offer.buyer_username || 'Unknown'}</p>
        {offer.message && <p><strong>Message:</strong> {offer.message}</p>}
        <p><strong>Status:</strong> <span className={`offer-status ${offer.status}`}>{offer.status}</span></p>

        {offer.status === 'pending' && (
          <div className="offer-actions">
            <button
              onClick={() => handleUpdateOfferStatus(offer.offer_id, 'accepted')}
              className="offer-button accept"
            >
              Accept
            </button>
            <button
              onClick={() => handleUpdateOfferStatus(offer.offer_id, 'rejected')}
              className="offer-button reject"
              style={{ marginLeft: '0.5rem' }}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
</div>

{/* My Offers (Buyer) */}
<div className="my-buyer-offers-section" style={{ marginTop: '2rem' }}>
  <div className="section-title-box">
  <h2>My Offers</h2>
</div>

  {loadingBuyerOffers && <p className="loading-text">Loading your offers...</p>}
  {errorBuyerOffers && <p className="error-text">{errorBuyerOffers}</p>}
  {!loadingBuyerOffers && myBuyerOffers.length === 0 && <p className="empty-text">You have not made any offers yet.</p>}

 <div className="horizontal-scroll-wrapper">
  <div className="offers-list">
    {myBuyerOffers.map(offer => (
      <div key={offer.offer_id} className="offer-card">
        <p><strong>Listing:</strong> {offer.listing_name || 'Unknown'}</p>
        <p><strong>Your Offer Price:</strong> ${offer.offer_price}</p>
        <p><strong>Status:</strong> <span className={`offer-status ${offer.status}`}>{offer.status}</span></p>
        {offer.message && <p><strong>Message:</strong> {offer.message}</p>}

        {offer.status === 'pending' && (
          <p className="waiting-text"><em>Waiting for seller response...</em></p>
        )}
        {offer.status === 'accepted' && (
          <p className="accepted-text">Your offer was accepted!</p>
        )}
        {offer.status === 'rejected' && (
          <p className="rejected-text">Your offer was rejected.</p>
        )}
      </div>
    ))}
  </div>
</div>
</div>

    </div>
  );
}
