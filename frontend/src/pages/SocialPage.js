import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AuthorShowcase from '../components/AuthorShowcase';
import styles from '../css/SocialPage.module.css'; // Import the CSS module

const SocialPage = ({ darkMode }) => {
  return (
    <Container fluid className={`${styles.socialPage} ${darkMode ? styles.dark : ''}`}>
      <Row className={`${styles.titleSection}`}>
        <Col>
          <h1>Mon entourage</h1>
          <p>Le lieu où vous n'oublierez jamais les personnes qui comptent.</p>
        </Col>
      </Row>

      <AuthorShowcase darkMode={darkMode} /> {/* Pass darkMode to AuthorShowcase */}
    </Container>
  );
};

export default SocialPage;