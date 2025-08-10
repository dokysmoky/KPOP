
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CreateListing.css';
import { useRef } from 'react';

function CreateListing() {
  const { user, token} = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    listing_name: '',
    description: '',
    condition: '',
    price: '',
    photo: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const hasCheckedAuth = useRef(false); //this is because there is a pop up twice for the user to log in before creating listing
  useEffect(() => {
  if (!user && !hasCheckedAuth.current) {
    hasCheckedAuth.current = true;
    alert("You must be logged in to create a listing.");
    navigate('/login');
  }
}, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, photo: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('listing_name', formData.listing_name);
    data.append('description', formData.description);
    data.append('condition', formData.condition);
    data.append('price', formData.price);
    if (formData.photo) {
      data.append('photo', formData.photo);
    }
    

    try {
      await axios.post('http://88.200.63.148:4200/listings', data, {
        headers: { 'Content-Type': 'multipart/form-data',
         'Authorization': `Bearer ${token}`
      }
    });
      alert('Listing created!');
      setFormData({
        listing_name: '',
        description: '',
        condition: '',
        price: '',
        photo: null,
      });
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      alert('Error creating listing');
    }
  };

  return (
    <div className="listing-page">
      <div className="background-overlay-image">
        <img src="/1.gif" alt="Background" />
      </div>
      <div className="listing-container">
        <div className="listing-box">
          <h2 className="listing-title">Create Listing</h2>
          <form onSubmit={handleSubmit} className="listing-form">
            <label>
              Name
              <input
                type="text"
                name="listing_name"
                value={formData.listing_name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Description
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Condition
              <input
                type="text"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Price
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Photo (optional)
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>

            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button
                  type="button"
                  className="remove-image-button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, photo: null }));
                    setImagePreview(null);
                  }}
                >
                  &times;
                </button>
              </div>
            )}

            <button type="submit" className="submit-button">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateListing;
