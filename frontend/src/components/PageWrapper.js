import React, { useEffect, useState } from 'react';
import styles from '../css/PageWrapper.module.css';

const PageWrapper = ({ children }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
 
    setVisible(true);
  }, []);

  return (
    <div className={`${styles.pageWrapper} ${visible ? styles.visible : ''}`}>
      {children}
    </div>
  );
};

export default PageWrapper;