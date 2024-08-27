import React, { useEffect } from 'react';
import styles from '../css/Overlay.module.css';

const Overlay = ({ visible, content, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 1000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.overlayContent}>
        {content}
      </div>
    </div>
  );
};

export default Overlay;