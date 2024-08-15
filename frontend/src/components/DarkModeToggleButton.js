import React from 'react';
import styles from '../css/DarkModeToggleButton.module.css';

const DarkModeToggleButton = ({ darkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className={styles.button}

    >
      {darkMode ? '🌞 Light Mode' : '🌜 Dark Mode'}
    </button>
  );
};

export default DarkModeToggleButton;