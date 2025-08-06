import React, {useMemo} from 'react'; 
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();

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

  return (
    <header className="header">
      <div className="header-title">KPOP Marketplace</div>
      <nav className="header-links">
        <Link to="/">Home</Link>
        <Link to="/listings">Listings</Link>
         <Link to="/create-listing">Create Listing</Link>
        {user ? (
  <>
    <Link to="/profile" className="profile-link">
      <img
  src={
    base64ProfilePicture
      ? `data:image/jpeg;base64,${base64ProfilePicture}`
      : '/7915522.png'
  }
  alt="Profile"
  className="header-profile-pic"
/>

    </Link>
    <span style={{ marginLeft: '0.5rem' }}>Hi, {user.username}</span>
    <button onClick={logout}>Logout</button>
  </>
) : (
  <>
    <Link to="/login">Login</Link>
    <Link to="/register">Register</Link>
  </>
)}

      </nav>
    </header>
  );
}

export default Header;


