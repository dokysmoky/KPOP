import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function CreateListing() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    listing_name: '',
    description: '',
    condition: '',
    price: '',
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in.");

    const data = new FormData();
    data.append('listing_name', formData.listing_name);
    data.append('description', formData.description);
    data.append('condition', formData.condition);
    data.append('price', formData.price);
    data.append('photo', formData.photo);
    data.append('user_id', user.user_id);

    try {
      const res = await axios.post(
        'http://88.200.63.148:4200/listings',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      alert('Listing created!');
      setFormData({
        listing_name: '',
        description: '',
        condition: '',
        price: '',
        photo: null,
      });
    } catch (err) {
      console.error(err);
      alert('Error creating listing');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Listing</h2>
      <input
        type="text"
        name="listing_name"
        placeholder="Name"
        value={formData.listing_name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="condition"
        placeholder="Condition"
        value={formData.condition}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={handleFileChange}
        required
      />
      <button type="submit">Create</button>
    </form>
  );
}

export default CreateListing;

