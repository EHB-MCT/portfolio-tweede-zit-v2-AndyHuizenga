import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AuthorShowcase from '../components/AuthorShowcase';

const SocialPage = () => {
  return (
    <Container fluid className="SocialPage">

      <AuthorShowcase />
    </Container>
  );
};

export default SocialPage;