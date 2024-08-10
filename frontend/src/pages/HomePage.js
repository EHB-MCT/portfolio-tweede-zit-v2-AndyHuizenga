import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import '../css/HomePage.css';

const HomePage = () => {
  const [images, setImages] = useState({ option1: '', option2: '' });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/content/assets');
        const assets = response.data;

        const imageMap = {
          option1: '',
          option2: ''
        };

        assets.forEach(asset => {
          if (asset.title === 'option1') {
            imageMap.option1 = asset.url;
          } else if (asset.title === 'option2') {
            imageMap.option2 = asset.url;
          }
        });

        setImages(imageMap);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <Container fluid className="home-page">
      <Row className="welcome-section text-center">
        <Col>
        
          <h1 className="welcome-title">Bienvenue à Recall</h1>
          <p className="welcome-subtitle">
            Vous pouvez explorer les éléments de rappel, qui sont des fragments précieux de votre vie, de différentes manières. Découvrez les options ci-dessous :
          </p>
        </Col>
      </Row>

      <Row className="card-section">
        <Card className="custom-card">
          <Card.Body>
            <Card.Title>Option 1</Card.Title>
            <Card.Text>
              Placez vos éléments « recall » sur le scanner pour accéder à leur contenu.
            </Card.Text>
            <div className="image-placeholder">
              <img src={images.option1} alt="Option 1" />
            </div>
          </Card.Body>
        </Card>

        <Card className="custom-card">
          <Card.Body>
            <Card.Title>Option 2</Card.Title>
            <Card.Text>
              Utilisez la télécommande pour naviguer à travers les différents éléments.
            </Card.Text>
            <div className="image-placeholder">
              <img src={images.option2} alt="Option 2" />
            </div>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default HomePage;
