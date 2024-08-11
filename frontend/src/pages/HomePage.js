import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import '../css/HomePage.css';
import API_BASE_URL from "./config";

const HomePage = () => {
  const [images, setImages] = useState({ option1: '', option2: '' });

  const fetchImages = async () => {
    try {
      // Define the asset names you want to fetch
      const assetNames = ['option1', 'option2'];

      // Send a POST request with the array of names
      const response = await axios.post(`${API_BASE_URL}/assets`, {
        names: assetNames,
      });
      
      const assets = response.data;

      // Map the assets to their corresponding options dynamically
      const imageMap = assetNames.reduce((acc, name) => {
        const asset = assets.find(asset => asset.title === name);
        acc[name] = asset ? asset.url : ''; // If asset is not found, set an empty string or a placeholder
        return acc;
      }, {});

      setImages(imageMap);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
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
