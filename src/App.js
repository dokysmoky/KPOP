import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
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
import CheckoutPage from './pages/CheckoutPage';

function App() {
  const { user, token } = useAuth();

  // Add to cart function, shared across pages
  const addToCart = async (productId) => {
    if (!user || !token) {
      return alert('Please login to add items to the cart');
    }
    try {
      const res = await fetch('http://88.200.63.148:4200/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Added to cart');
      } else {
        alert(data.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="app-container">
      <Router>
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<Listings onAddToCart={addToCart} />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route
              path="/listing/:product_id"
              element={<ListingDetailPage onAddToCart={addToCart} />}
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
