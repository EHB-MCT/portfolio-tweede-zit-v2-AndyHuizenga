import React from 'react';
import styles from '../css/RecallCard.module.css'; // Updated to import CSS module

const RecallCard = ({ item }) => {
  // Extract fields from item
  const { title, contentType, date, author, channel, thumbnail } = item;

  // Get the URL of the thumbnail image
  const imageUrl = thumbnail?.fields?.file?.url ? `https:${thumbnail.fields.file.url}` : '';

  // Format the channel number to always have two digits
  const formattedChannel = channel < 10 ? `0${channel}` : channel;

  return (
    <div className={styles.recallCard}>
      {/* Image */}
      {imageUrl && (
        <div className={styles.recallCardImage}>
          <img 
            src={imageUrl} 
            alt={title || 'No image available'} 
          />
        </div>
      )}

      {/* Channel Number */}
      <div className={styles.recallCardChannel}>
        {formattedChannel}
      </div>

      {/* Title */}
      <div className={styles.recallCardTitle}>
        {title}
      </div>
      
      {/* Content Type */}
      <div className={styles.recallCardType}>
        <em>{contentType}</em>
      </div>
    </div>
  );
};

export default RecallCard;