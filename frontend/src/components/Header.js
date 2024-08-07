import React, { useState, useEffect, useRef } from 'react';
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
    const value = event.target.value.replace(/\D/g, '').slice(0, 2); // Limit to 2 digits
    setInputValue(value);
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      console.log(`Input value on Enter: ${inputValue}`); // Log the input value
  
      if (inputValue === '00') {
        // Navigate to Home when '00' + [Enter] is pressed
        navigate('/');
        setChannelNumber(inputValue);
        setInputValue(''); // Clear the input value
        console.log('Navigating to Home');
      } else if (inputValue === '99') {
        // Navigate to Overview when '99' + [Enter] is pressed
        navigate('/overview');
        setChannelNumber(inputValue);
        setInputValue(''); // Clear the input value
        console.log('Navigating to Overview');
      } else if (inputValue === '98') {
        // Navigate to Overview when '99' + [Enter] is pressed
        navigate('/admin');
        setChannelNumber(inputValue);
        setInputValue(''); // Clear the input value
        console.log('Navigating to Overview');
      } else {
        // Navigate to the specific channel for other inputs
        setChannelNumber(inputValue);
        setInputValue('');
        console.log(`Channel changed to: ${inputValue}`);
        navigate(`/channel/${inputValue}`);
      }
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
    <>
      <header className="header">
        <div className="header-row">
          <div className="current-channel">
            <div className="channel-number">
              <strong>{inputValue || channelNumber}</strong>
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
        {/* Add channel-label and date back on top with absolute positioning */}
        <div className="channel-label">chaine</div>
        <div className="date">{formatDate(currentTime)}</div>
      </header>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="transparent-input"
        ref={inputRef}
      />
    </>
  );
};

export default Header;
