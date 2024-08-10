import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AuthorShowcase from '../components/AuthorShowcase';

const SocialPage = () => {
  return (
    <Container fluid className="SocialPage">
      <Row className="title-section text-center">
        <Col>
          <h1>Mon entourage</h1>
          <p>Le lieu où vous n'oublierez jamais les personnes qui comptent."</p>
        </Col>
      </Row>

      <AuthorShowcase />
    </Container>
  );
};

export default SocialPage;