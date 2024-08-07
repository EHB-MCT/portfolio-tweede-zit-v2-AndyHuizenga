import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap'; // Only Spinner from React Bootstrap
import ChannelContent from '../components/ChannelContent'; // Import the updated component
import ImageGallery from 'react-image-gallery';
import '../css/ChannelPage.css'; // Add this for custom styling
import 'react-image-gallery/styles/css/image-gallery.css'; // Import styles for react-image-gallery

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

  const images = channelContent?.content?.map((asset) => ({
    original: asset.fields.file.url,
    thumbnail: asset.fields.file.url,
    description: asset.fields.title,
  })) || [];

  return (
    <div className="channel-page">
      {loading ? (
        <Spinner animation="border" className="spinner" />
      ) : (
        <div className="channel-content">
          <div className="text-section">
            {/* Render content using ChannelContent component */}
            <ChannelContent content={channelContent} />
          </div>
          <div className="image-section">
            {images.length > 0 && (
              <ImageGallery items={images} showThumbnails={true} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelPage;
