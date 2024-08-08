import React, { useState, useEffect, useRef } from 'react';
import RecallCard from '../components/RecallCard';
import '../css/OverviewPage.css'; // Ensure to include your CSS file
import { Spinner } from 'react-bootstrap';

const OverviewPage = () => {
  const [recalls, setRecalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const scrollbarRef = useRef(null);

  useEffect(() => {
    const fetchRecalls = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/content`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Sort recalls by channel number (assuming channel is numeric)
        data.sort((a, b) => a.channel - b.channel);
        setRecalls(data);
      } catch (error) {
        console.error('Error fetching recalls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecalls()
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (container) {
      // Function to handle the horizontal scroll
      const handleWheel = (e) => {
        if (e.deltaY !== 0) {
          container.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      };

      // Add event listener for the wheel event
      window.addEventListener('wheel', handleWheel);

      return () => {
        // Clean up event listener
        window.removeEventListener('wheel', handleWheel);
      };
    }
  }, [recalls]);

  // Ensure the scroll container is focused
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.focus();
    }
  }, []);

  // Update custom scrollbar width and position
  useEffect(() => {
    const container = scrollContainerRef.current;
    const scrollbar = scrollbarRef.current;

    if (container && scrollbar) {
      const updateScrollbar = () => {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const thumbWidth = (clientWidth / scrollWidth) * 100;
        scrollbar.style.width = `${thumbWidth}%`;
        scrollbar.style.left = `${(scrollLeft / scrollWidth) * 100}%`;
      };

      container.addEventListener('scroll', updateScrollbar);
      updateScrollbar(); // Initial update

      return () => {
        container.removeEventListener('scroll', updateScrollbar);
      };
    }
  }, [recalls]);

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
      <div 
        className="recall-cards-container" 
        ref={scrollContainerRef} 
        tabIndex="0"  // Ensure it can receive focus
        role="region" // Optional: to indicate it’s a scrollable region
      >
        {recalls.length > 0 ? (
          recalls.map((item) => <RecallCard key={item.channel} item={item} />)
        ) : (
          <p>No recall items found.</p>
        )}
      </div>
      <div className="scrollbar-container">
        <div className="scrollbar-thumb" ref={scrollbarRef}></div>
      </div>
    </div>
  );
};

export default OverviewPage;
