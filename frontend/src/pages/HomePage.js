import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import styles from '../css/HomePage.module.css'; // Import CSS Module
import API_BASE_URL from "./config";

const HomePage = ({ darkMode }) => {
  const [greeting, setGreeting] = useState('Bonjour Christine');

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 18) {
      setGreeting('Bonsoir Christine');
    } else {
      setGreeting('Bonjour Christine');
    }
  }, []);

  return (
    <Container fluid className={`${styles.homePage} ${darkMode ? styles.dark : ''}`}>
      <Row className={`${styles.welcomeSection} text-center`}>
        <Col>
          <h3 className={styles.welcomeTitle}>{greeting}</h3>
          <h1 className={styles.welcomeSubtitle}>Bienvenue à Recall</h1>
        </Col>
      </Row>

      <Row className="text-center mb-4">
        <Col>
          <h3 className={styles.navigateTitle}>Comment naviguer l'application ?</h3>
        </Col>
      </Row>

      <Row className={styles.cardSection}>
        <Card className={styles.customCard}>
          <Card.Body className={styles.cardBody}>
            <Card.Title className={styles.customCardTitle}>Option 1</Card.Title>
            <Card.Text>
              Placez vos éléments lié sur le scanner pour accéder à leur contenu.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className={styles.customCard}>
          <Card.Body className={styles.cardBody}>
            <Card.Title className={styles.customCardTitle}>Option 2</Card.Title>
            <Card.Text>
              Utilisez la télécommande pour naviguer à travers les différents chaines.
            </Card.Text>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default HomePage;