import React, { useState, useEffect, useRef, useContext } from 'react';
import { Card } from 'react-bootstrap';
import styles from '../css/StepsShow.module.css';
import API_BASE_URL from '../pages/config';
import DataCacheContext from '../utils/DataCacheContext';

const StepsShow = ({ darkMode, setBackgroundImage }) => {
  const [stepsData, setStepsData] = useState({
    name: '',
    descriptionWholeStep: '',
    steps: []
  });
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const scrollbarRef = useRef(null);

  const { getCachedData, setCachedData } = useContext(DataCacheContext);

  useEffect(() => {
    const cachedSteps = getCachedData('stepsData');

    if (cachedSteps) {
      setStepsData(cachedSteps);
      if (cachedSteps.steps.length > 0) {
        const firstStepImage = cachedSteps.steps[0]?.url;
        if (firstStepImage) {
          setBackgroundImage(firstStepImage);
        }
      }
      setLoading(false);  // Set loading to false after retrieving data from cache
    } else {
      const fetchSteps = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/steps`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setStepsData(data);
          setCachedData('stepsData', data);
          if (data.steps.length > 0) {
            const firstStepImage = data.steps[0]?.url;
            if (firstStepImage) {
              setBackgroundImage(firstStepImage);
            }
          }
        } catch (error) {
          console.error('Error fetching steps:', error);
          setError(`Error fetching steps: ${error.message}. Please try again later.`);
        } finally {
          setLoading(false);  // Stop loading spinner
        }
      };

      fetchSteps();
    }
  }, [setBackgroundImage, getCachedData, setCachedData]);

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
      updateScrollbar();

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [stepsData.steps]);

  useEffect(() => {
    const handleWheel = (event) => {
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollLeft += event.deltaY;
        event.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [stepsData.steps]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${styles.stepsShowContainer} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.titleSection}>
        <h1>{stepsData.name || 'Steps Overview'}</h1>
        <p className={styles.overviewDescription}>
          {stepsData.descriptionWholeStep || 'Here’s a small description to guide you through the steps.'}
        </p>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className={styles.scrollContainer} ref={scrollContainerRef}>
        <div className={styles.scrollRow}>
          {stepsData.steps.length > 0 ? (
            stepsData.steps.map((step, index) => (
              <div className={styles.cardWrapper} key={index}>
                <Card className={`${styles.card} ${darkMode ? styles.dark : ''}`}>
                  <div className={styles.cardImgContainer}>
                    <Card.Img variant="top" src={step.url} alt={`Step ${index + 1}`} className={styles.cardImgTop} />
                  </div>
                  <div className={styles.cardBodyContainer}>
                    <div className={styles.cardNumber}>{index + 1}</div>
                    <Card.Body>
                      <Card.Text className={styles.cardText}>{step.description}</Card.Text>
                    </Card.Body>
                  </div>
                </Card>
              </div>
            ))
          ) : (
            <div className={styles.cardWrapper}>
              <Card className={`${styles.card} ${darkMode ? styles.dark : ''}`}>
                <Card.Body>
                  <Card.Text>No steps available</Card.Text>
                </Card.Body>
              </Card>
            </div>
          )}
        </div>
      </div>
      <div className={`${styles.scrollbarContainer} ${darkMode ? styles.dark : ''}`}>
        <div className={`${styles.scrollbarThumb} ${darkMode ? styles.dark : ''}`} ref={scrollbarRef}></div>
      </div>
      <div className={styles.scrollPrompt}>
        <i className="fas fa-chevron-down"></i> 
        <span>Faites défiler la molette noire pour voir plus d'éléments</span>
      </div>
    </div>
  );
};

export default StepsShow;