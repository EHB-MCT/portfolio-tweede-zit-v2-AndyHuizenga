import React, { useState, useEffect, useRef } from 'react';
import RecallCard from '../components/RecallCard';
import styles from '../css/OverviewPage.module.css'; // Import CSS module
import { Spinner } from 'react-bootstrap';
import API_BASE_URL from './config';

const OverviewPage = ({ darkMode }) => {  // Accept darkMode prop
  const [recalls, setRecalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const scrollbarRef = useRef(null);

  useEffect(() => {
    const fetchRecalls = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}`);
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

    fetchRecalls();
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (container) {
      const handleWheel = (e) => {
        if (e.deltaY !== 0) {
          container.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      };

      window.addEventListener('wheel', handleWheel);

      return () => {
        window.removeEventListener('wheel', handleWheel);
      };
    }
  }, [recalls]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.focus();
    }
  }, []);

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
      updateScrollbar();

      return () => {
        container.removeEventListener('scroll', updateScrollbar);
      };
    }
  }, [recalls]);

  if (loading) {
    return <Spinner animation="border" className={styles.spinner} />;
  }

  return (
    <div className={`${styles.overviewPage} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.topSection}>
        <div className={styles.topLeft}>
          <h1 className={styles.overviewTitle}>Liste de chaines</h1>
          <p className={styles.overviewDescription}>
          Voici un aperçu de toutes <br /> les chaînes disponibles. 
          </p>
        </div>
        <div className={styles.overviewCenterText}>
          <p>Pour naviguer vers la chaines desire</p>
        </div>
        <div className={styles.topRight}>
          {/* Optional content for the right section */}
        </div>
      </div>
      <div 
        className={styles.recallCardsContainer} 
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
      <div className={styles.scrollbarContainer}>
        {/* Apply the dark class to scrollbarThumb if darkMode is true */}
        <div className={`${styles.scrollbarThumb} ${darkMode ? styles.dark : ''}`} ref={scrollbarRef}></div>
      </div>
    </div>
  );
};

export default OverviewPage;