import React, { useState, useEffect, useRef } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(false); // New state for video playback
  const videoRef = useRef(null); // Reference to the video element
  const galleryRef = useRef(null); // Reference to the image gallery

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/content/recall/${channelNumber}`);
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

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '.') {
        if (channelContent.contentType === 'video' && videoRef.current) {
          if (isPlaying) {
            videoRef.current.pause();
          } else {
            videoRef.current.play();
          }
          setIsPlaying(prevIsPlaying => !prevIsPlaying); // Toggle playback state
        } else if (channelContent.contentType === 'album' && galleryRef.current) {
          galleryRef.current.slideToIndex(galleryRef.current.getCurrentIndex() + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying, channelContent]);

  if (loading) {
    return <Spinner animation="border" className="spinner" />;
  }

  const renderContent = () => {
    if (!channelContent) {
      return <div>No content available</div>;  // Handle case where channelContent is null or undefined
    }
  
    if (channelContent.contentType === 'album') {
      const images = channelContent.content.map((asset) => ({
        original: asset.fields.file.url,
        thumbnail: asset.fields.file.url,
      }));
  
      return (
        <ImageGallery ref={galleryRef} items={images} showThumbnails={true} showPlayButton={false} showFullscreenButton={false} />
      );
    } else if (channelContent.contentType === 'video') {
      const videoUrl = channelContent.content[0].fields.file.url;
  
      return (
        <video ref={videoRef} controls className="content-video">
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
      <span className="help-text-span">
        <p>Press [.] to {channelContent.contentType === 'video' ? 'play/pause the video' : 'move ' +'to the next picture'}.</p>
      </span>
    </div>
  );
};

export default ChannelPage;
