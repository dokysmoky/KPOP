import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Listing from '../components/Listings';
import '../App.css';
import '../components/Header.css';


function ListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);

  // For now, dummy data, later fetch from backend
  useEffect(() => {
    const dummyListings = [
      { id: 1, title: 'Cool photocard #1', description: 'A rare KPOP photocard.' },
      { id: 2, title: 'Shiny photocard #2', description: 'Limited edition photocard.' },
    ];
    setListings(dummyListings);
  }, []);

  return (
    <div>
      <h2>All Listings</h2>
      {listings.map(listing => (
        <Listing key={listing.id} listing={listing} user={user} />
      ))}
    </div>
  );
}

export default ListingsPage;
