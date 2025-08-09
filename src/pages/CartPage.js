import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import '../components/Header.css';

function CartPage() {
  const { user, token } = useAuth();
  const [cart, setCart] = useState({ cart_id: null, items: [] });
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !(user?.id || user?.user_id)) return;

    async function fetchCart() {
      try {
        const userId = user.id || user.user_id;
        const res = await fetch(`http://88.200.63.148:4200/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }

    fetchCart();
  }, [token, user]);


  async function handleRemove(cartItemId) {
    if (!token || !user) {
      alert('Please login to modify cart');
      return;
    }

    try {
      const res = await fetch(`http://88.200.63.148:4200/cart/remove/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setCart(prev => ({
          ...prev,
          items: prev.items.filter(item => item.cart_item_id !== cartItemId),
        }));
      } else {
        const errData = await res.json();
        alert(`Failed to remove from cart: ${errData.message}`);
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
      alert('Failed to remove from cart');
    }
  }

  return (
    <div>
      <h2>Your Cart</h2>
      {(!cart.items || cart.items.length === 0) && <p>Your cart is empty.</p>}
      {cart.items && cart.items.map(item => (
        <div key={item.cart_item_id} className="cart-item">
          <img
            src={
              item.photo?.startsWith('data:image')
                ? item.photo
                : `data:image/jpeg;base64,${item.photo}` || '/3.png'
            }
            alt={item.listing_name}
            style={{ width: '100px' }}
          />
          <h3>{item.listing_name}</h3>
          <p>Price: ${item.price}</p>
          <p>Quantity: {item.quantity}</p>
          <button onClick={() => handleRemove(item.cart_item_id)}>Remove</button>
        </div>
      ))}

      {cart.items && cart.items.length > 0 && (
        <button
          style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
          onClick={() => navigate('/checkout', { state: { cart } })}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
}

export default CartPage;

