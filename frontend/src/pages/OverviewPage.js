// src/pages/OverviewPage.js
import React, { useState, useEffect } from 'react';
import RecallCard from '../components/RecallCard';
import '../css/OverviewPage.css'; // Ensure to include your CSS file
import { Spinner } from 'react-bootstrap';

const OverviewPage = () => {
  const [recalls, setRecalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecalls = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/content`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecalls(data);
      } catch (error) {
        console.error('Error fetching recalls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecalls();
  }, []);

  if (loading) {
    return <Spinner animation="border" className="spinner" />;
  }

  return (
    <div className="overview-page">
      <div className="top-section">
        <div className="top-left">
          <h1 className="overview-title">Liste de chaines</h1>
          <p className="overview-description">
            Lorem ipsum dolor sit amet, consetetur sadipscing <br /> elitr, sed diam nonumy eirmod
          </p>
        </div>
        <div className="overview-center-text">
          <p>Pour naviguer vers la chaines desire</p>
        </div>
        <div className="top-right">
          {/* Empty div or any other content for the right section */}
        </div>
      </div>
      <div className="recall-cards-container">
        {recalls.length > 0 ? (
          recalls.map((item) => <RecallCard key={item.channel} item={item} />)
        ) : (
          <p>No recall items found.</p>
        )}
      </div>
    </div>
  );
};

export default OverviewPage;
