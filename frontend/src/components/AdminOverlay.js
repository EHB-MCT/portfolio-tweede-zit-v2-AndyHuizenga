import React, { useState, useEffect, useRef } from 'react';
import styles from '../css/AdminOverlay.module.css';

const AdminOverlay = ({ visible, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue === 'admin') {
      onClose(); // Close the overlay when the password is correct
    } else {
      setErrorMessage('Incorrect password, please try again.');
      setInputValue(''); // Reset the input value
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <h2>Admin Login</h2>
        <input
          type="password"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={styles.adminInput}
          ref={inputRef}
          placeholder="Enter Admin Password"
        />
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      </div>
    </div>
  );
};

export default AdminOverlay;