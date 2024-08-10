import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import axios from 'axios';
import '../css/AuthorShowcase.css';

const AuthorShowcase = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
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
      <Row className="text-center mb-4"> yeah
      </Row>

      <Carousel
        indicators={false}
        interval={null}
        controls={true}
        slide={true}
        wrap={false}
      >
        {authors.map((author, index) => (
          <Carousel.Item key={index}>
            <Card className="mx-auto author-card">
              <Row noGutters>
                <Col md={4} className="image-col"> {/* 2/5 of 12 columns is 4 */}
                  <Card.Img
                    src={author.profilePictureUrl}
                    alt={`${author.name}'s picture`}
                    className="img-fluid"
                  />
                </Col>
                <Col md={8} className="text-col"> {/* 3/5 of 12 columns is 8 */}
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
