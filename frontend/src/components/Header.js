import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../css/Header.css';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [channelNumber, setChannelNumber] = useState('01'); // Displayed channel number
  const [inputValue, setInputValue] = useState(''); // Current input
  const inputRef = useRef(null); // Create a ref for the input field
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize socket connection
    const socket = io('http://localhost:3001', {
      transports: ['websocket'],
      withCredentials: true
    });

    // Handle successful connection
    socket.on('connect', () => {
      console.log('Socket connected successfully!');
    });

    // Handle receiving NFC tag data
    socket.on('tagNumber', (data) => {
      console.log('Received tagNumber event:', data);
      if (data) {
        handleNfcRead(data);
      } else {
        console.error('Received empty data');
      }
    });

    // Handle socket errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  // Handle NFC tag data
  const handleNfcRead = (text) => {
    console.log('Handling NFC read text:', text);
    setChannelNumber(text);
    navigate(`/channel/${text}`);
  };

  // Handle changes to the input field
  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Update the current input
  };

  // Handle key press events in the input field
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setChannelNumber(inputValue); // Update the displayed channel number
      setInputValue(''); // Clear the input field
      console.log(`Channel changed to: ${inputValue}`);
      navigate(`/channel/${inputValue}`);
    }
  };

  // Update the current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
      console.log('Time interval cleared'); // Log when the interval is cleared
    };
  }, []);

  // Focus the input field on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input field on component mount
      console.log('Input field focused');
    }
  }, []);

  // Format time as HH:MM
  const formatTime = (date) => {
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    console.log(`Formatted time: ${time}`); // Log formatted time
    return time;
  };

  // Format date as Weekday, Day Month
  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    console.log(`Formatted date: ${formattedDate}`); // Log formatted date
    return formattedDate;
  };

  return (
    <header className="bg-light py-3">
      <Container>
        <Row className="align-items-center">
          {/* Left Block: Current Channel */}
          <Col md={4} className="text-left">
            <div className="current-channel">
              <div className="channel-label">chaine actuel:</div>
              <div className="channel-number">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type channel number and press Enter"
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: 'black',
                  }}
                  ref={inputRef}
                />
                <div className="channel-display">
                  <strong>{inputValue || channelNumber}</strong> {/* Display the live input or the confirmed channel number */}
                </div>
              </div>
            </div>
          </Col>

          {/* Middle Block: Smart TV / Saver Screen */}
          <Col md={4} className="text-center">
            <div className="tv-info">
              <div className="time-date">
                <div className="date">{formatDate(currentTime)}</div>
                <div className="time">{formatTime(currentTime)}</div>
              </div>
            </div>
          </Col>

          {/* Right Block: Help Text */}
          <Col md={4} className="text-right">
            <div className="help-text">
              <p>Need Assistance?</p>
              <p>Contact support at support@example.com</p>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
