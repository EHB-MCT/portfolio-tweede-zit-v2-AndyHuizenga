// src/components/RecallCard.js
import React from 'react';
import '../css/RecallCard.css'; // Ensure to include your CSS file

const RecallCard = ({ item }) => {
  // Extract fields from item
  const { title, contentType, date, author, channel, thumbnail } = item;

  // Get the URL of the thumbnail image
  const imageUrl = thumbnail?.fields?.file?.url ? `https:${thumbnail.fields.file.url}` : '';

  // Format the channel number to always have two digits
  const formattedChannel = channel < 10 ? `0${channel}` : channel;

  return (
    <div className="recall-card">
      {/* Image */}
      {imageUrl && (
        <div className="recall-card-image">
          <img 
            src={imageUrl} 
            alt={title || 'No image available'} 
          />
        </div>
      )}

      {/* Channel Number */}
      <div className="recall-card-channel">
        {formattedChannel}
      </div>

      {/* Title */}
      <div className="recall-card-title">
        {title}
      </div>
      
      {/* Content Type */}
      <div className="recall-card-type">
        <em>{contentType}</em>
      </div>
    </div>
  );
};

export default RecallCard;
