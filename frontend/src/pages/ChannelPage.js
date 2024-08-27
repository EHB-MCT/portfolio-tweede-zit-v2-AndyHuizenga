import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Modal, Button } from 'react-bootstrap'; 
import ChannelContent from '../components/ChannelContent';
import ImageGallery from 'react-image-gallery';
import '../css/ChannelPage.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import API_BASE_URL from './config';
import { FaInfoCircle } from 'react-icons/fa';  // Import the info icon
import DataCacheContext from '../utils/DataCacheContext'; //

const ChannelPage = ({ darkMode, setBackgroundImage }) => {
  const { channelNumber } = useParams();
  const [channelContent, setChannelContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const galleryRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate(); 

  const { getCachedData, setCachedData } = useContext(DataCacheContext); 

  useEffect(() => {
    const cachedChannelData = getCachedData(`channel-data-${channelNumber}`);
    const cachedBgImage = getCachedData(`channel-bg-${channelNumber}`);

    if (cachedChannelData && cachedBgImage) {
      setChannelContent(cachedChannelData);
      setBackgroundImage(cachedBgImage);
      setLoading(false);
    } else {
      const fetchContent = async () => {
        setLoading(true);
        setChannelContent(null);

        try {
          const response = await fetch(`${API_BASE_URL}/recall/${channelNumber}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const content = await response.json();
          setChannelContent(content);
          setCachedData(`channel-data-${channelNumber}`, content); 

          
          let bgImage = '';
          if (content.contentType === 'album' && content.content.length > 0) {
            bgImage = content.content.find(item =>
              item.fields.file.url.endsWith('.jpg') || item.fields.file.url.endsWith('.png')
            )?.fields.file.url || '';
          } else if (content.contentType === 'video' && content?.thumbnail?.fields?.file?.url) {
            bgImage = content.thumbnail.fields.file.url;
          }

          if (bgImage) {
            setBackgroundImage(bgImage);
            setCachedData(`channel-bg-${channelNumber}`, bgImage); 
          }
        } catch (error) {
          setShowModal(true); 
        } finally {
          setLoading(false); 
        }
      };

      fetchContent();
    }
  }, [channelNumber, getCachedData, setCachedData, setBackgroundImage]);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        navigate('/overview');
      }, 4000); 
      return () => clearTimeout(timer); 
    }
  }, [showModal, navigate]);

  const handleModalClose = () => {
    navigate('/overview');
  };

  useEffect(() => {
    const handleKeyDown = (event) => handleKeyPress(event);
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [channelContent, isPlaying]);

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
        event.preventDefault(); 
        const direction = event.deltaY > 0 ? 1 : -1;

        
        const videos = channelContent.content?.filter(asset => asset.fields?.file?.url && asset.fields.file.url.endsWith('.mp4'));
        if (videos && videos.length > 0) {
          setCurrentVideoIndex((prevIndex) => {
            const newIndex = Math.max(0, Math.min(videos.length - 1, prevIndex + direction));
            return newIndex;
          });
        }
      } else if (channelContent?.contentType === 'album' && galleryRef.current) {
        event.preventDefault();
        const direction = event.deltaY > 0 ? 1 : -1;
        const currentIndex = galleryRef.current.getCurrentIndex();
        const nextIndex = Math.max(0, Math.min(galleryRef.current.props.items.length - 1, currentIndex + direction));
        galleryRef.current.slideToIndex(nextIndex);
      }
    };

    window.addEventListener('wheel', handleMouseWheel); 
    return () => window.removeEventListener('wheel', handleMouseWheel);
  }, [channelContent, isPlaying]);

  const handleSlide = (currentIndex) => {
    const currentImage = galleryRef.current.props.items[currentIndex].original;
    setBackgroundImage(currentImage); 
  };

  const renderContent = () => {
    if (!channelContent) {
      return <div>No content available</div>;
    }

    if (channelContent.contentType === 'album') {
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
              autoPlay  
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
      <span className={`help-text-span ${darkMode ? 'dark-mode' : ''}`}>
        <p> {channelContent?.contentType === 'video' ? 'Utilisez la molette pour passer à la video suivante' : 'Utilisez la molette pour passer à la photo suivante'}.</p>
      </span>

      <Modal
        show={showModal}
        onHide={handleModalClose}
        centered
        className="no-border-modal"
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Body className="text-center">
          Ce canal n'a pas encore de contenu. Vous serez redirigé vers la vue d'ensemble.
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ChannelPage;