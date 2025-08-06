import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Listing from '../components/Listings';
import '../App.css';
import '../components/Header.css';


function ListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);

  /*// For now, dummy data, later fetch from backend
  useEffect(() => {
    const dummyListings = [
      { id: 1, title: 'Cool photocard #1', description: 'A rare KPOP photocard.' },
      { id: 2, title: 'Shiny photocard #2', description: 'Limited edition photocard.' },
    ];
    setListings(dummyListings);
  }, []);*/

  /*useEffect(() => {
  const fetchListings = async () => {
    try {
      const response = await fetch('88.200.63.148:4200/listings');
      const data = await response.json();
      setListings(data.listings);
      setListings(data.listings);
console.log('Fetched listings:', data.listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };*/
  // Listings.js
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
      {listings.map(listing => (
        <Listing key={listing.id} listing={listing} user={user} />
      ))}
    </div>
    </div>
  );
}

export default ListingsPage;
