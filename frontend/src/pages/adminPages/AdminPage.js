import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUserPlus, FaFileAlt, FaCog } from 'react-icons/fa'; // Importing icons from react-icons
import '../../css/AdminPage.css'; // Import your CSS file

const AdminPage = () => {
  return (
    <Container className="admin-page">
      <h1>Admin Dashboard</h1>
      <Row className="justify-content-center mt-5">
        <Col md={4}>
          <Link to="/admin/create-author" className="card-link">
            <Card className="admin-card light-blue-card">
              <Card.Body className="admin-card-body">
                <FaUserPlus className="admin-card-icon" />
                <Card.Title className="admin-card-title">Create New Author</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4}>
          <Link to="/admin/create-entry" className="card-link">
            <Card className="admin-card purple-card">
              <Card.Body className="admin-card-body">
                <FaFileAlt className="admin-card-icon" />
                <Card.Title className="admin-card-title">Create New Entry</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4}>
          <Link to="/admin/settings" className="card-link">
            <Card className="admin-card light-grey-card">
              <Card.Body className="admin-card-body">
                <FaCog className="admin-card-icon" />
                <Card.Title className="admin-card-title">Settings</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
