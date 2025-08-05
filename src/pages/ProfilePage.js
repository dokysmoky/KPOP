
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../App.css';
import '../components/Header.css';
import './ProfilePages.css';

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [age, setAge] = useState(user?.age || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePicture, setProfilePicture] = useState(null);

  function uint8ArrayToString(u8Array) {
    const CHUNK_SIZE = 0x8000;
    let result = '';
    for (let i = 0; i < u8Array.length; i += CHUNK_SIZE) {
      result += String.fromCharCode.apply(null, u8Array.subarray(i, i + CHUNK_SIZE));
    }
    return result;
  }

  const base64ProfilePicture = useMemo(() => {
    if (!user?.profile_picture?.data) return null;
    try {
      const u8arr = new Uint8Array(user.profile_picture.data);
      const binaryString = uint8ArrayToString(u8arr);
      return btoa(binaryString);
    } catch (e) {
      console.error('Error encoding profile picture', e);
      return null;
    }
  }, [user?.profile_picture?.data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.user_id) {
      alert('You must be logged in to update your profile.');
      return;
    }

    const formData = new FormData();
    formData.append('age', age);
    formData.append('bio', bio);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    try {
      const response = await axios.put(
        `http://88.200.63.148:4200/profile/${user.user_id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setUser(response.data.updatedUser);
      localStorage.setItem('user', JSON.stringify(response.data.updatedUser));
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2 className="profile-title">My Profile</h2>

        {user && base64ProfilePicture && (
          <div className="profile-picture-container">
            <img
              src={`data:image/jpeg;base64,${base64ProfilePicture}`}
              alt="Profile"
              className="profile-picture"
            />
          </div>
        )}

        <div className="profile-info">
          <div className="info-box"><strong>Username:</strong> {user?.username}</div>
          <div className="info-box"><strong>Name:</strong> {user?.name}</div>
          <div className="info-box"><strong>Surname:</strong> {user?.surname}</div>
          <div className="info-box"><strong>Email:</strong> {user?.email}</div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <label>
            <strong>Bio:</strong>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </label>

          <label>
            <strong>Age:</strong>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          </label>

          <label>
            <strong>Profile Picture:</strong>
            <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
          </label>

          <button type="submit" className="save-button">Save</button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
