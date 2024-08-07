import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap'; // Only Spinner and Container from React Bootstrap
import '../css/ChannelPage.css'; // Add this for custom styling

const ChannelPage = () => {
  const { channelNumber } = useParams();
  const [channelContent, setChannelContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/content/${channelNumber}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.json();
        setChannelContent(content);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [channelNumber]);

  return (
    <Container fluid className="channel-page">
      {loading ? (
        <Spinner animation="border" className="spinner" />
      ) : (
        <div className="channel-content">
          <div className="text-section">
            {channelContent.descriptions.content.map((item, index) => {
              if (item.nodeType === 'heading-1') {
                return <h1 key={index}>{item.content[0].value}</h1>;
              } else if (item.nodeType === 'heading-3') {
                return <h3 key={index}>{item.content[0].value}</h3>;
              } else if (item.nodeType === 'heading-6') {
                return <h6 key={index}>{item.content[0].value}</h6>;
              } else if (item.nodeType === 'paragraph') {
                return <p key={index}>{item.content[0].value}</p>;
              } else {
                return null;
              }
            })}
          </div>
          <div className="image-section">
            {channelContent.content.map((asset, index) => (
              <img
                key={index}
                src={asset.fields.file.url}
                alt={asset.fields.title}
                className="content-image"
              />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};

export default ChannelPage;
