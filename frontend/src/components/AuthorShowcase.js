import React, { useState, useEffect, useRef, useContext } from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import axios from 'axios';
import styles from '../css/SocialPage.module.css';
import API_BASE_URL from '../pages/config';
import DataCacheContext from '../utils/DataCacheContext'; // Import the cache context

const AuthorShowcase = ({ darkMode, setBackgroundImage }) => {
  const [authors, setAuthors] = useState([]);
  const carouselRef = useRef(null);

  const { getCachedData, setCachedData } = useContext(DataCacheContext); // Access cache context

  useEffect(() => {
    const cachedAuthors = getCachedData('authors');

    if (cachedAuthors) {
      setAuthors(cachedAuthors);
      if (cachedAuthors.length > 0) {
        setBackgroundImage(cachedAuthors[0].profilePictureUrl);
      }
    } else {
      const fetchAuthors = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/authors`);
          setAuthors(response.data);

          // Set the background image to the first author image
          if (response.data.length > 0) {
            setBackgroundImage(response.data[0].profilePictureUrl);
          }

          // Cache the fetched authors data
          setCachedData('authors', response.data);
        } catch (error) {
          console.error('Error fetching authors:', error);
        }
      };

      fetchAuthors();
    }
  }, [setBackgroundImage, getCachedData, setCachedData]);

  useEffect(() => {
    const handleWheel = (event) => {
      if (carouselRef.current) {
        const { deltaY } = event;
        if (deltaY > 0) {
          carouselRef.current.next();
        } else {
          carouselRef.current.prev();
        }
        event.preventDefault();
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [authors]);

  const handleSlide = (selectedIndex) => {
    if (authors[selectedIndex]) {
      setBackgroundImage(authors[selectedIndex].profilePictureUrl);
    }
  };

  return (
    <Container fluid className={styles.AuthorShowcase}>
      <Carousel
        indicators={false}
        interval={null}
        controls={true}
        slide={true}
        wrap={false}
        ref={carouselRef}
        className={styles.carouselInner}
        onSlide={handleSlide}
      >
        {authors.map((author, index) => (
          <Carousel.Item key={index}>
            <Card className={`mx-auto ${styles.authorCard} ${darkMode ? styles.dark : ''}`}>
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
                    <Card.Text className="fst-italic">
                      {author.relationship}
                    </Card.Text>
                    <Card.Title>{author.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
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