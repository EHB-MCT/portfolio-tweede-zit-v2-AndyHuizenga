import React, { createContext, useContext, useState } from 'react';

// Create a context for dark mode
const DarkModeContext = createContext();

// Create a custom hook to use the dark mode context
export const useDarkMode = () => {
  return useContext(DarkModeContext);
};

// DarkModeProvider component to wrap around the app
export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};