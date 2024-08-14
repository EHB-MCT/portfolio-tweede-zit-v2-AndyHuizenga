import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import axios from 'axios';
import styles from '../css/AuthorShowcase.module.css'; // Import CSS module
import API_BASE_URL from '../pages/config';

const AuthorShowcase = () => {
  const [authors, setAuthors] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/authors`);
        setAuthors(response.data);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    fetchAuthors();
  }, []);

  useEffect(() => {
    const handleWheel = (event) => {
      if (carouselRef.current) {
        const { deltaY } = event;
        if (deltaY > 0) {
          // Scroll down
          carouselRef.current.next();
        } else {
          // Scroll up
          carouselRef.current.prev();
        }
        event.preventDefault(); // Prevent the default vertical scroll behavior
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [authors]);

  return (
    <Container fluid className={styles.AuthorShowcase}> 
      <Row className="text-center mb-4">
        <Col>
          {/* You can add a title or any content here */}
        </Col>
      </Row>

      <Carousel
        indicators={false}
        interval={null}
        controls={true}
        slide={true}
        wrap={false}
        ref={carouselRef}
        className={styles.carouselInner} // Added class to ensure proper layout
      >
        {authors.map((author, index) => (
          <Carousel.Item key={index}>
            <Card className={`mx-auto ${styles.authorCard}`}> 
              <Row noGutters>
                <Col md={4} className={styles.imageCol}> 
                  <Card.Img
                    src={author.profilePictureUrl || '/path/to/default-image.jpg'}
                    alt={`${author.name}'s picture`}
                    className={styles.cardImg} 
                  />
                </Col>
                <Col md={8} className={styles.textCol}> 
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