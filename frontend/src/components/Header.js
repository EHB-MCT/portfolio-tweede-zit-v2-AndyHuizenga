import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Overlay from '../components/Overlay';
import '../css/Header.css';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [channelNumber, setChannelNumber] = useState('01');
  const [inputValue, setInputValue] = useState('');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayContent, setOverlayContent] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Function to handle NFC read events
  const handleNfcRead = useCallback(
    (text) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Handling NFC read text:', text);

        // Special handling for specific numbers
        switch (text) {
          case '00':
            navigate('/');
            break;
          case '99':
            navigate('/overview'); 
            break;
          case '98':
            navigate('/admin');
            break;
          case '97':
            navigate('/social');
            break;
          case '50':
            navigate('/steps');
            break;
          default:
            // For regular channel numbers
            if (/^\d{2}$/.test(text)) { // Ensure it's a two-digit number
              navigate(`/channel/${text}`);
            } else {
              console.error('Invalid NFC data:', text);
            }
        }
        setChannelNumber(text); // Update channelNumber regardless
      }
    },
    [navigate]
  );

  // UseEffect for socket connection
  useEffect(() => {
    let socket;

    if (process.env.NODE_ENV === 'development') {
      socket = io('http://localhost:3001');

      socket.on('connect', () => {
        console.log('Socket connected successfully!');
      });

      socket.on('tagNumber', (data) => {
        console.log('Received tagNumber event:', data);
        if (data) {
          handleNfcRead(data);
        } else {
          console.error('Received empty data');
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

  // Update the time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
      console.log('Time interval cleared');
    };
  }, []);

  // Focus the input field when the component is mounted
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      console.log('Input field focused');
    }
  }, []);

  // Format the time to be displayed
  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Format the date to be displayed
  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-GB', options);
  };

  // Handle input change to limit it to 2 digits
  const handleInputChange = (event) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 2);
    setInputValue(value);
  };

  // Handle key down events for number input and overlay display
  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log('Key pressed:', event.key, 'Key code:', event.code);

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
          inputRef.current.focus(); // Ensure input field is always focused for numbers
        }
        const number = keyMapping[event.code];
        const newValue = (inputValue + number).slice(0, 2);
        console.log(`New input value: ${newValue}`);
        setInputValue(newValue);
        setOverlayContent(newValue);
        setOverlayVisible(true); // Show overlay dynamically with input

        if (newValue.length === 2) {
          setTimeout(() => {
            setOverlayVisible(false);
            console.log('Overlay hidden after two digits');

            // Special numbers handling
            if (newValue === '00') {
              navigate('/');
            } else if (newValue === '99') {
              navigate('/overview'); 
            } else if (newValue === '98') {
              navigate('/admin');
            } else if (newValue === '97') {
              navigate('/social');
            } else if (newValue === '50') {
              navigate('/steps');
            } else if (newValue >= '01' && newValue <= '50') {
              navigate(`/channel/${newValue}`);
            }

            // Update channelNumber only if the newValue is valid
        
              setChannelNumber(newValue);
          

            // Clear inputValue only if a valid new number was processed
            if (newValue.length === 2) {
              setInputValue('');
            }
          }, 500);
        }
      } else if (event.key === ',') {
        // Handle the comma key for content navigation
        event.preventDefault();
        console.log('Comma key pressed for navigation');
        // Add your logic for navigating content with the comma key here
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputValue, navigate]);

  return (
    <>
      <header className="header">
        <div className="header-row">
          <div className="current-channel">
            <div className="channel-number">
              <strong>{channelNumber}</strong> {/* Display channelNumber */}
            </div>
          </div>
          <div className="tv-info">
            <div className="time-date">
              <div className="time">{formatTime(currentTime)}</div>
            </div>
          </div>
          <div className="help-text">
            <div className="help-text-content">
              <p>00 + [ENTER] pour l’acuelle</p>
              <p>99 + [ENTER] pour les chaines</p>
            </div>
          </div>
        </div>
        <div className="channel-label">chaine</div>
        <div className="date">{formatDate(currentTime)}</div>
      </header>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="transparent-input"
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