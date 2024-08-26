import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Overlay from '../components/Overlay';
import styles from '../css/Header.module.css';

const Header = ({ darkMode, isVerificationModalOpen }) => {   
  const [currentTime, setCurrentTime] = useState(new Date());
  const [channelNumber, setChannelNumber] = useState('01');
  const [inputValue, setInputValue] = useState('');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayContent, setOverlayContent] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleNfcRead = useCallback(
    (text) => {
      if (process.env.NODE_ENV === 'development') {
        switch (text) {
          case '00':
            navigate('/overview');
            break;
          case '99':
            navigate('/admin');
            break;
          case '98':
            navigate('/');
            break;
          case '10':
            navigate('/social');
            break;
          case '11':
            navigate('/steps');
            break;
          default:
            if (/^\d{2}$/.test(text)) {
              navigate(`/channel/${text}`);
            }
        }
        setChannelNumber(text);
      }
    },
    [navigate]
  );

  useEffect(() => {
    let socket;

    if (process.env.NODE_ENV === 'development') {
      socket = io('http://localhost:3001');

      socket.on('connect', () => {
        console.log('Socket connected successfully!');
      });

      socket.on('tagNumber', (data) => {
        if (data) {
          handleNfcRead(data);
        }
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [handleNfcRead]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-GB', options);
  };

  const handleInputChange = (event) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 2);
    setInputValue(value);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isVerificationModalOpen) {
        return; // Prevent keydown event when modal is open
      }

      const keyMapping = {
        'Digit1': '1',
        'Digit2': '2',
        'Digit3': '3',
        'Digit4': '4',
        'Digit5': '5',
        'Digit6': '6',
        'Digit7': '7',
        'Digit8': '8',
        'Digit9': '9',
        'Digit0': '0',
        'Numpad1': '1',
        'Numpad2': '2',
        'Numpad3': '3',
        'Numpad4': '4',
        'Numpad5': '5',
        'Numpad6': '6',
        'Numpad7': '7',
        'Numpad8': '8',
        'Numpad9': '9',
        'Numpad0': '0',
      };

      if (keyMapping[event.code]) {
        event.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
        const number = keyMapping[event.code];
        const newValue = (inputValue + number).slice(0, 2);
        setInputValue(newValue);
        setOverlayContent(newValue);
        setOverlayVisible(true);

        if (newValue.length === 2) {
          setTimeout(() => {
            setOverlayVisible(false);

            if (newValue === '00') {
              navigate('/overview');
            } else if (newValue === '99') {
              navigate('/admin');
            } else if (newValue === '98') {
              navigate('/');
            } else if (newValue === '10') {
              navigate('/social');
            } else if (newValue === '11') {
              navigate('/steps');
            } else if (newValue >= '01' && newValue <= '20') {
              navigate(`/channel/${newValue}`);
            }

            setChannelNumber(newValue);
            setInputValue('');
          }, 1000);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputValue, navigate, isVerificationModalOpen]);

  return (
    <>
      <header className={`${styles.header} ${darkMode ? styles.darkMode : ''}`}>
        <div className={styles.headerRow}>
          <div className={styles.currentChannel}>
            <div className={styles.channelNumber}>
              <strong>{channelNumber}</strong>
            </div>
          </div>
          <div className={styles.tvInfo}>
            <div className={styles.timeDate}>
              <div className={styles.time}>{formatTime(currentTime)}</div>
            </div>
          </div>
          <div className={styles.helpText}>
            <div className={styles.helpTextContent}>
              <p>00 + [ENTER] pour les chaines</p>
              <p>98 + [ENTER] pour les l'accuelle</p>
            </div>
          </div>
        </div>
        <div className={styles.channelLabel}>chaine</div>
        <div className={styles.date}>{formatDate(currentTime)}</div>
      </header>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={styles.transparentInput}
        ref={inputRef}
      />
      <Overlay
        visible={overlayVisible}
        content={overlayContent}
        onClose={() => setOverlayVisible(false)}
      />
    </>
  );
};

export default Header;