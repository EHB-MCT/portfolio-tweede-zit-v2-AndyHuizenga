import React from 'react';

const PageWrapper = ({ children }) => {
  return (
    <div style={{ height: '80vh' }}>
      {children}
    </div>
  );
};

export default PageWrapper;
