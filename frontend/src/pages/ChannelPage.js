import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import ChannelContent from '../components/ChannelContent';
import ImageGallery from 'react-image-gallery';
import '../css/ChannelPage.css';
import 'react-image-gallery/styles/css/image-gallery.css';

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

  if (loading) {
    return <Spinner animation="border" className="spinner" />;
  }

  const renderContent = () => {
    if (channelContent.contentType === 'album') {
      const images = channelContent.content.map((asset) => ({
        original: asset.fields.file.url,
        thumbnail: asset.fields.file.url,
      }));

      return <ImageGallery items={images} showThumbnails={true} showPlayButton={false} showFullscreenButton={false} />;
    } else if (channelContent.contentType === 'video') {
      const videoUrl = channelContent.content[0].fields.file.url; // Assuming there's a single video file

      return (
        <video controls className="content-video">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <div>Unsupported content type</div>;
    }
  };

  return (
    <div className="channel-page">
      <div className="channel-content">
        <div className="text-section">
          <ChannelContent content={channelContent} />
        </div>
        <div className="image-section">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
