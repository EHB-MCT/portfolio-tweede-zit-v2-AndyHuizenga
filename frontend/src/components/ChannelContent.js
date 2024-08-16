import React from 'react';

function ChannelContent({ content }) {
  if (!content) {
    console.warn("No content available");
    return <div>No content available</div>;
  }

  const author = content.author?.fields;
  const profilePictureUrl = author?.profilePicture?.fields?.file?.url || 'default-profile-picture.jpg';

  return (
    <div className="channel-content-container">
      {content.title && <h1 className="content-title">{content.title}</h1>}
      {content.date && <p className="content-date">{new Date(content.date).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>}
      {content.description && <p className="content-description">{content.description}</p>}

      {author ? (
        <div className="author-section">
          {/* No padding for author's thumbnail */}
          <img 
            src={profilePictureUrl} 
            alt={author.name || "Unknown Author"} 
            className="author-thumbnail" /* Different class for author thumbnail */
          />
          <div className="author-info">
            {content.contentType && (
              <div className="content-type">
                {content.contentType} created by {author.name || "Unknown Author"}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>No author information available.</div>
      )}
    </div>
  );
}

export default ChannelContent;