import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Listings from './pages/Listings';
import './App.css';
import './components/Header.css';
import ProfilePage from './pages/ProfilePage';
import CreateListing from './components/CreateListing';
import Footer from './components/Footer';
import WishlistPage from './pages/WishlistPage'; 
import ListingDetailPage from './pages/ListingDetailPage';
import Cart from './pages/CartPage';


function App() {
  return (
    <div className="app-container">
      <Router>
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/wishlist" element={<WishlistPage />} /> 
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/listing/:product_id" element={<ListingDetailPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

