import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AuthorShowcase from '../components/AuthorShowcase';
import styles from '../css/SocialPage.module.css'; // Import the CSS module

const SocialPage = () => {
  return (
    <Container fluid className={styles.socialPage}> {/* Use CSS module for styling */}
      <Row className={`${styles.titleSection} text-center`}> {/* Combine CSS module class with Bootstrap class */}
        <Col>
          <h1>Mon entourage</h1>
          <p>Le lieu où vous n'oublierez jamais les personnes qui comptent.</p> {/* Removed extraneous quote */}
        </Col>
      </Row>

      <AuthorShowcase />
    </Container>
  );
};

export default SocialPage;