import React, { useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AuthorShowcase from '../components/AuthorShowcase';
import styles from '../css/SocialPage.module.css'; // Import the CSS module

const SocialPage = ({ darkMode, setBackgroundImage }) => {
  const scrollContainerRef = useRef(null);
  const scrollbarRef = useRef(null);

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
  }, []);

  return (
    <Container fluid className={`${styles.socialPage} ${darkMode ? styles.dark : ''}`}>
      <Row className={`${styles.titleSection}`}>
        <Col>
          <h1>Mon entourage</h1>
          <p>Le lieu où vous n'oublierez jamais les personnes qui comptent.</p>
        </Col>
      </Row>

      {/* Author Showcase with scrolling functionality */}
      <div className={styles.scrollContainer} ref={scrollContainerRef}>
        <AuthorShowcase darkMode={darkMode} setBackgroundImage={setBackgroundImage} />
      </div>

      {/* Scroll Prompt above the scrollbar */}
      <div className={styles.scrollPrompt}>
        <i className="fas fa-chevron-down"></i>
        <span>Faites défiler la molette noire pour voir plus d'éléments</span>
      </div>

      {/* Custom scrollbar at the bottom */}
      <div className={`${styles.scrollbarContainer} ${darkMode ? styles.dark : ''}`}>
        <div className={`${styles.scrollbarThumb} ${darkMode ? styles.dark : ''}`} ref={scrollbarRef}></div>
      </div>
    </Container>
  );
};

export default SocialPage;