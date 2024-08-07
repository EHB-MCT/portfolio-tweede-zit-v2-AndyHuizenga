import React from 'react';
// Ensure to include your CSS file

function ChannelContent({ content }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="channel-content-container">
      {/* Render the content type */}
      {content.contentType && <div className="content-type">{content.contentType}</div>}
      
      {/* Render the title if it exists */}
      {content.title && <h1 className="content-title">{content.title}</h1>}
      
      {/* Render the date if it exists */}
      {content.date && <p className="content-date">{formatDate(content.date)}</p>}
      
      {/* Render the description if it exists */}
      {content.description && <p className="content-description">{content.description}</p>}
    </div>
  );
}

export default ChannelContent;
