import React from 'react';
import '../css/PageWrapper.css'; // Import the CSS file for custom styles

const PageWrapper = ({ children }) => {
  return (
    <div className="page-wrapper">
      {children}
    </div>
  );
};

export default PageWrapper;
