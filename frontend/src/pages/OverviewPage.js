import React, { useState, useEffect, useRef } from 'react';
import RecallCard from '../components/RecallCard';
import styles from '../css/OverviewPage.module.css'; // Import CSS module
import { Spinner } from 'react-bootstrap';
import API_BASE_URL from './config';

const OverviewPage = ({ darkMode }) => {
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

    // Automatically focus on the scroll container when the page loads
    if (container) {
      container.focus();
    }

    const handleWheel = (e) => {
      // Apply horizontal scroll based on the vertical wheel input
      if (e.deltaY !== 0) {
        container.scrollLeft += e.deltaY;
        e.preventDefault();  // Prevent default vertical scroll
      }
    };

    // Add the wheel event listener to the window
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);  // Clean up event listener on unmount
    };
  }, [recalls]);

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
          <p>Utilisez la molette pour passer chaines suivante.</p>
        </div>
        <div className={styles.topRight}></div>
      </div>
      <div 
        className={styles.recallCardsContainer} 
        ref={scrollContainerRef} 
        tabIndex="0"  // Ensure the container can receive focus
        role="region" // Optional: to indicate it’s a scrollable region
      >
        <div className={styles.scrollRow}>
          {recalls.length > 0 ? (
            recalls.map((item) => (
              <div className={styles.cardWrapper} key={item.channel}>
                <RecallCard item={item} />
              </div>
            ))
          ) : (
            <p>No recall items found.</p>
          )}
        </div>
      </div>
      <div className={styles.scrollbarContainer}>
        <div className={`${styles.scrollbarThumb} ${darkMode ? styles.dark : ''}`} ref={scrollbarRef}></div>
      </div>
    </div>
  );
};

export default OverviewPage;