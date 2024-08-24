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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
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

        // Set the background image based on the first content item or the video thumbnail
        if (content?.contentType === 'album' && content.content?.length > 0) {
          const firstImage = content.content.find(item => item.fields.file.url.endsWith('.jpg') || item.fields.file.url.endsWith('.png'))?.fields.file.url || '';
          setBackgroundImage(firstImage);
        } else if (content?.contentType === 'video' && content?.thumbnail?.fields?.file?.url) {
          const videoThumbnail = content.thumbnail.fields.file.url;
          setBackgroundImage(videoThumbnail); // Set the video thumbnail as the background
        }
      } catch (error) {
        setChannelContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [channelNumber, setBackgroundImage]);

  const handleKeyPress = (event) => {
    if (event.key === '<' && channelContent?.contentType === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const handleMouseWheel = (event) => {
      if (channelContent?.contentType === 'video') {
        event.preventDefault(); // Prevent default scroll behavior
        const direction = event.deltaY > 0 ? 1 : -1;

        // Handle video scrolling navigation
        const videos = channelContent.content?.filter(asset => asset.fields?.file?.url && asset.fields.file.url.endsWith('.mp4'));

        if (videos && videos.length > 0) {
          setCurrentVideoIndex((prevIndex) => {
            const newIndex = Math.max(0, Math.min(videos.length - 1, prevIndex + direction));
            return newIndex;
          });
        }
      } else if (channelContent?.contentType === 'album' && galleryRef.current) {
        // Handle image gallery scrolling navigation
        event.preventDefault();
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
  }, [channelContent, isPlaying]);

  const handleSlide = (currentIndex) => {
    const currentImage = galleryRef.current.props.items[currentIndex].original;
    setBackgroundImage(currentImage); // Set the background image to the current item in the album
  };

  const renderContent = () => {
    if (!channelContent) {
      return <div>No content available</div>;
    }

    if (channelContent.contentType === 'album') {
      // Handle only images for the gallery
      const images = (channelContent.content?.filter(asset => asset.fields?.file?.url && (asset.fields.file.url.endsWith('.jpg') || asset.fields.file.url.endsWith('.png'))) || []).map((asset) => ({
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
          )}
        />
      );
    } else if (channelContent.contentType === 'video') {
      // Handle multiple videos with scroll navigation
      const videos = channelContent.content?.filter(asset => asset.fields?.file?.url && asset.fields.file.url.endsWith('.mp4'));

      if (videos && videos.length > 0) {
        const videoUrl = videos[currentVideoIndex].fields.file.url;

        return (
          <div className="video-container">
            <video
              ref={videoRef}
              className="padded-image"
              controls
              key={videoUrl}
              style={{
                width: '840px',
                height: '551px',
                objectFit: 'cover'
              }}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      } else {
        return <div>No videos available</div>;
      }
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
        <p>{channelContent?.contentType === 'video' ? 'Appuyez sur [.] pour lire/mettre en pause la vidéo' : 'Utilisez la molette pour passer a la photo suivante'}.</p>
      </span>
    </div>
  );
};

export default ChannelPage;