import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../css/Header.css';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [channelNumber, setChannelNumber] = useState('01');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io('http://localhost:3001', {
      transports: ['websocket'],
      withCredentials: true
    });

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

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  const handleNfcRead = (text) => {
    console.log('Handling NFC read text:', text);
    setChannelNumber(text);
    navigate(`/channel/${text}`);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setChannelNumber(inputValue);
      setInputValue('');
      console.log(`Channel changed to: ${inputValue}`);
      navigate(`/channel/${inputValue}`);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
      console.log('Time interval cleared');
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      console.log('Input field focused');
    }
  }, [inputValue]);

  const formatTime = (date) => {
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    console.log(`Formatted time: ${time}`);
    return time;
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    console.log(`Formatted date: ${formattedDate}`);
    return formattedDate;
  };

  return (
    <header className="bg-light header">
      <Container>
        <Row className="align-items-center">
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
                  <strong>{inputValue || channelNumber}</strong>
                </div>
              </div>
            </div>
          </Col>

          <Col md={4} className="text-center">
            <div className="tv-info">
              <div className="time-date">
                <div className="date">{formatDate(currentTime)}</div>
                <div className="time">{formatTime(currentTime)}</div>
              </div>
            </div>
          </Col>

          <Col md={4} className="text-right">
            <div className="help-text">
              <p>00 + [ENTER] pour l’acuelle</p>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
