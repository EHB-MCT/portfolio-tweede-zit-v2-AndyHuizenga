import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import styles from '../css/StepsShow.module.css'; // Import CSS module
import API_BASE_URL from '../pages/config';

const StepsShow = () => {
  const [stepsData, setStepsData] = useState({
    name: '',
    descriptionWholeStep: '',
    steps: []
  });
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const scrollbarRef = useRef(null);

  // Fetch steps data from API
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/steps`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data) {
          setStepsData(data);
        } else {
          console.error('Unexpected data format:', data);
          setStepsData({
            name: '',
            descriptionWholeStep: '',
            steps: []
          });
        }
      } catch (error) {
        console.error('Error fetching steps:', error.message);
        setError('Error fetching steps. Please try again later.');
      }
    };

    fetchSteps();
  }, []);

  // Update scrollbar style
  useEffect(() => {
    const container = scrollContainerRef.current;
    const scrollbar = scrollbarRef.current;

    const updateScrollbar = () => {
      if (container && scrollbar) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const thumbWidth = (clientWidth / scrollWidth) * 100;
        scrollbar.style.width = `${thumbWidth}%`;
        scrollbar.style.left = `${(scrollLeft / scrollWidth) * 100}%`;
      }
    };

    const handleScroll = () => {
      updateScrollbar();
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
      updateScrollbar(); // Initial update

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [stepsData.steps]);

  // Handle mouse wheel scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleWheel = (event) => {
      if (container) {
        container.scrollLeft += event.deltaY;
        event.preventDefault(); // Prevent the default vertical scroll behavior
      }
    };

    if (container) {
      container.addEventListener('wheel', handleWheel);

      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [stepsData.steps]);

  // Function to focus on scroll container
  const focusScrollContainer = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.focus();
    }
  };

  return (
    <div className={styles.stepsShowContainer}>
      <div className={styles.titleSection}>
        <h1>{stepsData.name || 'Steps Overview'}</h1>
        <p className={styles.overviewDescription}>
          {stepsData.descriptionWholeStep || 'Here’s a small description to guide you through the steps.'}
        </p>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div 
        className={styles.scrollContainer} 
        ref={scrollContainerRef} 
        tabIndex="0" // Ensure it can receive focus
        role="region" // Optional: to indicate it’s a scrollable region
      >
        <div className={styles.scrollRow}>
          {stepsData.steps.length > 0 ? (
            stepsData.steps.map((step, index) => (
              <div className={styles.cardWrapper} key={index}>
                <Card className={styles.card}>
                  <div className={styles.cardImgContainer}>
                    <Card.Img variant="top" src={step.url} alt={`Step ${index + 1}`} className={styles.cardImgTop} />
                  </div>
                  <div className={styles.cardNumber}>{index + 1}</div> {/* Display step number */}
                  <Card.Body>
                    <Card.Text className={styles.cardText}>{step.description}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <div className={styles.cardWrapper}>
              <Card className={styles.card}>
                <Card.Body>
                  <Card.Text>No steps available</Card.Text>
                </Card.Body>
              </Card>
            </div>
          )}
        </div>
      </div>
      <div className={styles.scrollbarContainer}>
        <div className={styles.scrollbarThumb} ref={scrollbarRef}></div>
      </div>
      <div className={styles.scrollPrompt} onClick={focusScrollContainer}>
        <i className="fas fa-chevron-down"></i> 
        <span>Faites défiler la molette noire pour voir plus d'éléments</span>
      </div>
    </div>
  );
};

export default StepsShow;