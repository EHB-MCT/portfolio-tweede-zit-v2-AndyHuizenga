import React, { useState } from 'react'; // Import useState here
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUserPlus, FaFileAlt, FaCog } from 'react-icons/fa'; 
import styles from '../../css/AdminPage.module.css';
import AdminOverlay from '../../components/AdminOverlay'; // Import AdminOverlay

const AdminPage = ({ darkMode }) => {
  const [isAdminOverlayVisible, setAdminOverlayVisible] = useState(true); // Now useState is defined

  const handleCloseAdminOverlay = () => {
    setAdminOverlayVisible(false);
  };

  if (isAdminOverlayVisible) {
    return (
      <AdminOverlay
        visible={isAdminOverlayVisible}
        onClose={handleCloseAdminOverlay}
      />
    );
  }

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

      </Row>
    </Container>
  );
};

export default AdminPage;