import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../css/HomePage.css'; // Import CSS for styling

const HomePage = () => {
  return (
    <Container fluid className="home-page">
      {/* Welcome Section */}
      <Row className="welcome-section text-center">
        <Col>
          <h1>Welcome to Recall</h1>
          <p>The place where the past and future is put within your reach.</p>
        </Col>
      </Row>

      {/* Cards Section */}
      <Row className="card-section">
        <Col md={6} className="d-flex align-items-stretch">
          <Card className="w-100 border-dark">
            <Card.Body>
              <Card.Title>Option 1</Card.Title>
              <Card.Text>
                Place your “recall” items on the scanner to access its content.
              </Card.Text>
              <div className="image-placeholder">Image Here</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="d-flex align-items-stretch">
          <Card className="w-100 border-dark">
            <Card.Body>
              <Card.Title>Option 2</Card.Title>
              <Card.Text>
                Use the remote to move across the different items.
              </Card.Text>
              <div className="image-placeholder">Image Here</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
