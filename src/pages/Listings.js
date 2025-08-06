import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Listing from '../components/Listings';
import '../App.css';
import '../components/Header.css';


function ListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  
useEffect(() => {
  async function fetchListings() {
    try {
      const response = await fetch('http://88.200.63.148:4200/listings');
      const data = await response.json(); // <-- fails if response is HTML
      console.log('Fetched listings:', data.listings);
      setListings(data.listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  }

  fetchListings();
}, []);


  return (
    <div>
      <h2>All Listings</h2> 
      <div className="listings-container">
     {listings.map((listing) => (
  <Listing key={listing.product_id} listing={listing} user={user}/>
))}

    </div>
    </div>
  );
}

export default ListingsPage;
