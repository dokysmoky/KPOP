import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import '../components/Header.css';
import './Checkout.css';

function CheckoutPage({ onOrderPlaced }) {
  const { token, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

const [cart, setCart] = useState({ items: [] });

  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pay_on_pickup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SHIPPING_COST = 5;

  const cartTotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = cartTotal + SHIPPING_COST;

useEffect(() => {
  async function fetchCart() {
    if (!token) return;
    try {
      const res = await fetch('http://88.200.63.148:4200/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  }
  fetchCart();
}, [token]);


  useEffect(() => {
    async function fetchUserProfile() {
      if (!token || !user?.id) return;
      try {
        const res = await fetch(`http://88.200.63.148:4200/profile/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.address) setAddress(data.address);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    }
    fetchUserProfile();
  }, [token, user]);

  if (!cart || !cart.items || cart.items.length === 0) {
    return <p className="empty-cart-msg">Your cart is empty. Please add items before checking out.</p>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://88.200.63.148:4200/order/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ address, payment_method: paymentMethod }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || 'Checkout failed');
        return;
      }

      alert(`Order placed! Order ID: ${data.order_id}. Total: $${data.order_amount}`);
      if (onOrderPlaced) onOrderPlaced();
    } catch (err) {
      setLoading(false);
      setError('Checkout error');
      console.error(err);
    }
  }

  return (
     <div className="backg">
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h2 className="checkout-title">Checkout</h2>

      <label className="form-label">
        Shipping Address:
        <textarea 
          className="address-input"
          value={address} 
          onChange={e => setAddress(e.target.value)} 
          required 
          rows={3}
        />
      </label>

      <fieldset className="payment-methods">
        <legend>Payment Method:</legend>
        <label>
          <input 
            type="radio" 
            name="payment_method" 
            value="pay_on_pickup" 
            checked={paymentMethod === 'pay_on_pickup'} 
            onChange={() => setPaymentMethod('pay_on_pickup')} 
          />
          Pay on Pickup
        </label>
        <label>
          <input 
            type="radio" 
            name="payment_method" 
            value="credit_card" 
            checked={paymentMethod === 'credit_card'} 
            onChange={() => setPaymentMethod('credit_card')} 
          />
          Credit Card (dummy)
        </label>
      </fieldset>

      <div className="price-summary">
        <p>Items total: <span>${cartTotal.toFixed(2)}</span></p>
        <p>Shipping cost: <span>${SHIPPING_COST.toFixed(2)}</span></p>
        <p className="total-amount">Total: <span>${totalAmount.toFixed(2)}</span></p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <button className="place-order-btn" type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
    </div>
  );
}

export default CheckoutPage;

