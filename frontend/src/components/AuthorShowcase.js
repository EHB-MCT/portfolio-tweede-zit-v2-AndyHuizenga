import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import axios from 'axios';

const AuthorShowcase = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    // Fetch authors from the API
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/content/authors');
        setAuthors(response.data);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <Container fluid className="AuthorShowcase">
      <Row className="text-center mb-4">
        <Col>
          <h2>Meet the Authors</h2>
        </Col>
      </Row>

      <Carousel indicators={false} interval={null} className="author-carousel">
        {authors.map((author, index) => (
          <Carousel.Item key={index}>
            <Card className="mx-auto author-card">
              <Row>
                <Col md={4} className="d-flex align-items-center">
                  <Card.Img
                    src={author.profilePictureUrl}  // Use the correct URL for the image
                    alt={`${author.name}'s picture`}
                    className="img-fluid"
                  />
                </Col>
                <Col md={8}>
                  <Card.Body>
                    <Card.Text className="text-muted fst-italic">
                      {author.relationship}
                    </Card.Text>
                    <Card.Title>{author.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {author.code ? `Code: ${author.code}` : 'No Title Provided'}
                    </Card.Subtitle>
                    <Card.Text>{author.description}</Card.Text>
                    <Card.Text>
                      <strong>Birthday:</strong> {author.bday}
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default AuthorShowcase;
