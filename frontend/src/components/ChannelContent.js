import React from 'react';
// Ensure to include your CSS file

function ChannelContent({ content }) {
  return (
    <div className="channel-content-container">
      {/* Render the title if it exists */}
      {content.title && <h1 className="content-title">{content.title}</h1>}
      
      {/* Render the date if it exists */}
      {content.date && <p className="content-date">{new Date(content.date).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>}
      
      {/* Render the description if it exists */}
      {content.description && <p className="content-description">{content.description}</p>}

      {/* Render the author and content type if they exist */}
      {content.author && (
        <div className="author-section">
          {content.author.fields.profilePicture && (
            <img src={content.author.fields.profilePicture.fields.file.url} alt={content.author.fields.name} className="author-image" />
          )}
          <div className="author-info">
          
            {content.contentType && (
              <div className="content-type">
                {content.contentType} creé par {content.author.fields.name}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChannelContent;
