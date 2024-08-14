import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import ChannelContent from '../components/ChannelContent';
import ImageGallery from 'react-image-gallery';
import '../css/ChannelPage.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import API_BASE_URL from "./config";

const ChannelPage = () => {
  const { channelNumber } = useParams();
  const [channelContent, setChannelContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const galleryRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log('Fetching content for channel:', channelNumber);
        const response = await fetch(`${API_BASE_URL}/recall/${channelNumber}`);
        console.log('Fetch response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.json();
        console.log('Content received from backend:', content);
        setChannelContent(content);
      } catch (error) {
        console.error('Error fetching content:', error);
        setChannelContent(null);
      } finally {
        setLoading(false); 
      }
    };

    fetchContent();
  }, [channelNumber]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '<') {
        if (channelContent?.contentType === 'video' && videoRef.current) {
          if (isPlaying) {
            videoRef.current.pause();
          } else {
            videoRef.current.play();
          }
          setIsPlaying(prevIsPlaying => !prevIsPlaying);
        }
      }
    };

    const handleMouseWheel = (event) => {
      if (channelContent?.contentType === 'album' && galleryRef.current) {
        event.preventDefault(); // Prevent default scroll behavior
        const direction = event.deltaY > 0 ? 1 : -1;
        const currentIndex = galleryRef.current.getCurrentIndex();
        const nextIndex = Math.max(0, Math.min(galleryRef.current.props.items.length - 1, currentIndex + direction));
        galleryRef.current.slideToIndex(nextIndex);
      }
    };

    const container = containerRef.current;

    if (container) {
      container.addEventListener('wheel', handleMouseWheel);
      window.addEventListener('keydown', handleKeyPress);

      return () => {
        container.removeEventListener('wheel', handleMouseWheel);
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isPlaying, channelContent]);

  if (loading) {
    return <Spinner animation="border" className="spinner" />;
  }

  const renderContent = () => {
    if (!channelContent) {
      return <div>No content available</div>;
    }

    if (channelContent.contentType === 'album') {
      const images = (channelContent.content?.filter(asset => asset.fields?.file?.url) || []).map((asset) => ({
        original: asset.fields.file.url || 'default-thumbnail.jpg',
        thumbnail: asset.fields.file.url || 'default-thumbnail.jpg',
      }));
  
      return (
        <ImageGallery ref={galleryRef} items={images} showThumbnails={true} showPlayButton={false} showFullscreenButton={false} />
      );
    } else if (channelContent.contentType === 'video') {
      const videoUrl = channelContent.content?.[0]?.fields?.file?.url || '';
  
      return (
        videoUrl ? (
          <video ref={videoRef} controls className="content-video">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div>Video not available</div>
        )
      );
    } else {
      return <div>Unsupported content type</div>;
    }
  };

  return (
    <div className="channel-page">
      <div className="channel-content" ref={containerRef}>
        <div className="text-section">
          <ChannelContent content={channelContent} />
        </div>
        <div className="image-section">
          {renderContent()}
        </div>
      </div>
      {channelContent && (
        <span className="help-text-span">
          <p>Press [.] to {channelContent.contentType === 'video' ? 'play/pause the video' : 'move to the next picture'}.</p>
        </span>
      )}
    </div>
  );
};

export default ChannelPage;