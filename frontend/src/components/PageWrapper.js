import React from 'react';
import styles from '../css/PageWrapper.module.css'; // Updated to import CSS module

const PageWrapper = ({ children }) => {
  return (
    <div className={styles.pageWrapper}>
      {children}
    </div>
  );
};

export default PageWrapper;