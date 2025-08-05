/*import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../App.css';
import '../components/Header.css';

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [age, setAge] = useState(user.age || '');
  const [bio, setBio] = useState(user.bio || '');
  const [profilePicture, setProfilePicture] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Current user:', user);
    if (!user || !user.user_id) {
    alert('You must be logged in to update your profile.');
    return;
  }
  if (!user) {
  return <p>Please <a href="/login">login</a> to view your profile.</p>;
}

    const formData = new FormData();
    formData.append('age', age);
    formData.append('bio', bio);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    try {
        const response = await axios.put(`http://88.200.63.148:4200/profile/${user.user_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update local user info
      setUser(response.data.updatedUser);
      localStorage.setItem("user", JSON.stringify(response.data.updatedUser)); // persist user in localStorage
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Age:
          <input type="number" value={age} onChange={e => setAge(e.target.value)} />
        </label>
        <label>
          Bio:
          <textarea value={bio} onChange={e => setBio(e.target.value)} />
        </label>
        <label>
          Profile Picture:
          <input type="file" onChange={e => setProfilePicture(e.target.files[0])} />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default ProfilePage;*/


import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../App.css';
import '../components/Header.css';

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [age, setAge] = useState(user?.age || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePicture, setProfilePicture] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Current user:', user);
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

      // Update local user info
      setUser(response.data.updatedUser);
      localStorage.setItem("user", JSON.stringify(response.data.updatedUser));
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      {user && user.profile_picture && (
  <div>
    <h4>Current Profile Picture:</h4>
    <img
      
      alt="Profile"
      style={{
        width: '150px',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '50%',
        marginBottom: '1rem'
      }}
    />
  </div>
)}
      <form onSubmit={handleSubmit}>
        <label>
          Age:
          <input type="number" value={age} onChange={e => setAge(e.target.value)} />
        </label>
        <label>
          Bio:
          <textarea value={bio} onChange={e => setBio(e.target.value)} />
        </label>
        <label>
          Profile Picture:
          <input type="file" onChange={e => setProfilePicture(e.target.files[0])} />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default ProfilePage;
