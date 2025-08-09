import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import '../components/Header.css';


function CheckoutPage({ onOrderPlaced }) {
  const { token, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const cart = location.state?.cart || { items: [] };

  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pay_on_pickup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SHIPPING_COST = 5;

  const cartTotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = cartTotal + SHIPPING_COST;

  useEffect(() => {
    // Fetch user profile to prefill address, if available
    async function fetchUserProfile() {
      if (!token || !user?.id) return;
      try {
        const res = await fetch(`http://88.200.63.148:4200/profile/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        // Assume user profile has address field or you can store it elsewhere
        if (data.address) setAddress(data.address);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    }
    fetchUserProfile();
  }, [token, user]);
if (!cart || !cart.items || cart.items.length === 0) {
    return <p>Your cart is empty. Please add items before checking out.</p>;
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
    <form onSubmit={handleSubmit}>
      <h2>Checkout</h2>

      <label>
        Shipping Address:
        <textarea 
          value={address} 
          onChange={e => setAddress(e.target.value)} 
          required 
          rows={3}
          style={{ width: '100%' }}
        />
      </label>

      <div>
        <p>Payment Method:</p>
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
        <label style={{ marginLeft: '20px' }}>
          <input 
            type="radio" 
            name="payment_method" 
            value="credit_card" 
            checked={paymentMethod === 'credit_card'} 
            onChange={() => setPaymentMethod('credit_card')} 
          />
          Credit Card (dummy)
        </label>
      </div>

      <p>Items total: ${cartTotal.toFixed(2)}</p>
      <p>Shipping cost: ${SHIPPING_COST.toFixed(2)}</p>
      <p><strong>Total: ${totalAmount.toFixed(2)}</strong></p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}

export default CheckoutPage;
