import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUserPlus, FaFileAlt, FaCog } from 'react-icons/fa'; // Importing icons from react-icons
import styles from '../../css/AdminPage.module.css'; // Updated to import CSS module

const AdminPage = ({ darkMode }) => { // Accept darkMode as a prop
  return (
    <Container className={`${styles.adminPage} ${darkMode ? styles.darkMode : ''}`}>
      <h1>Admin Dashboard</h1>
      <Row className="justify-content-center mt-5">
        <Col md={4}>
          <Link to="/admin/create-author" className={styles.cardLink}>
            <Card className={`${styles.adminCard} ${styles.lightBlueCard}`}>
              <Card.Body className={styles.adminCardBody}>
                <FaUserPlus className={styles.adminCardIcon} />
                <Card.Title className={styles.adminCardTitle}>Create New Author</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4}>
          <Link to="/admin/create-entry" className={styles.cardLink}>
            <Card className={`${styles.adminCard} ${styles.purpleCard}`}>
              <Card.Body className={styles.adminCardBody}>
                <FaFileAlt className={styles.adminCardIcon} />
                <Card.Title className={styles.adminCardTitle}>Create New Entry</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4}>
          <Link to="/admin/settings" className={styles.cardLink}>
            <Card className={`${styles.adminCard} ${styles.lightGreyCard}`}>
              <Card.Body className={styles.adminCardBody}>
                <FaCog className={styles.adminCardIcon} />
                <Card.Title className={styles.adminCardTitle}>Settings</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;