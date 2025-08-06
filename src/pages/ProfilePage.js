import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../App.css';
import '../components/Header.css';
import './ProfilePages.css'; 

export default function ProfilePage() {
  const { user, token, setUser } = useAuth();
  const [age, setAge] = useState(user?.age || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

      const updatedUser = response.data.updatedUser || {};
      let profile_picture_url = null;
      if (updatedUser.profile_picture && updatedUser.profile_picture.data) {
        profile_picture_url = `data:image/jpeg;base64,${bufferToBase64(updatedUser.profile_picture)}`;
      }

      const userToStore = {
  ...user,
  age: updatedUser.age,
  bio: updatedUser.bio,
  ...(profile_picture_url && { profile_picture_url }), // only add if it exists
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
        position: 'relative'
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
            src={previewUrl || user?.profile_picture_url || '/7915522.png'}
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
    </div>
  );
}
