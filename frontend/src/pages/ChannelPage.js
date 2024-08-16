import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import ChannelContent from '../components/ChannelContent';
import ImageGallery from 'react-image-gallery';
import '../css/ChannelPage.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import API_BASE_URL from './config';

const ChannelPage = ({ darkMode, setBackgroundImage }) => {
  const { channelNumber } = useParams();
  const [channelContent, setChannelContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const galleryRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/recall/${channelNumber}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.json();
        setChannelContent(content);

        // Check if the content type is video and set the thumbnail as the background
        if (content?.contentType === 'video' && content?.thumbnail?.fields?.file?.url) {
          const videoThumbnail = content.thumbnail.fields.file.url;
          setBackgroundImage(videoThumbnail); // Set the video thumbnail as the background
        } else if (content?.contentType === 'album' && content.content?.length > 0) {
          const firstImage = content.content[0]?.fields?.file?.url || '';
          if (firstImage) {
            setBackgroundImage(firstImage); // Set the first image as the background
          }
        }
      } catch (error) {
        setChannelContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [channelNumber, setBackgroundImage]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '.') {
        if (channelContent?.contentType === 'video' && videoRef.current) {
          if (isPlaying) {
            videoRef.current.pause();
          } else {
            videoRef.current.play();
          }
          setIsPlaying((prevIsPlaying) => !prevIsPlaying);
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

  const handleSlide = (currentIndex) => {
    const currentImage = galleryRef.current.props.items[currentIndex].original;
    setBackgroundImage(currentImage); // Set the background image to the current image in the album
  };

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
        <ImageGallery
          ref={galleryRef}
          items={images}
          showThumbnails={true}
          showPlayButton={false}
          showFullscreenButton={false}
          onSlide={handleSlide}
          renderItem={(item) => (
            <img src={item.original} className="padded-image" alt="gallery item" />
          )} // Apply padded-image class here
        />
      );
    } else if (channelContent.contentType === 'video') {
      const videoUrl = channelContent.content?.[0]?.fields?.file?.url || '';

      return (
        videoUrl ? (
          <video ref={videoRef} className="padded-image" controls>
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

  if (loading) {
    return <Spinner animation="border" className="spinner" />;
  }

  return (
    <div className={`channel-page ${darkMode ? 'dark-mode' : ''}`} ref={containerRef}>
      <div className="channel-content">
        <div className="text-section">
          <ChannelContent content={channelContent} />
        </div>
        <div className="image-section">
          {renderContent()}
        </div>
      </div>
      <span className="help-text-span">
        <p>{channelContent?.contentType === 'video' ? 'Press [.] to play/pause the video' : 'Use the wheel to move to the next picture'}.</p>
      </span>
    </div>
  );
};

export default ChannelPage;