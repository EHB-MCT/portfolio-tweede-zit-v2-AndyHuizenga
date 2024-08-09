import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../../css/AdminPage.css'; // Assuming you want to style this page separately

const AdminPage = () => {
  return (
    <Container className="admin-page">
      <Row className="justify-content-center">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Create New Author</Card.Title>
              <Link to="/admin/create-author" className="btn btn-primary">Go</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Create New Entry</Card.Title>
              <Link to="/admin/create-entry" className="btn btn-primary">Go</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Settings</Card.Title>
              <Link to="/admin/settings" className="btn btn-primary">Go</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
