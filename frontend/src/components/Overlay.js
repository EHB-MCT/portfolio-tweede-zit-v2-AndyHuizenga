import React, { useEffect } from 'react';
import '../css/Overlay.css'; 

const Overlay = ({ visible, content, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 1000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-content">
        {content}
      </div>
    </div>
  );
};

export default Overlay;