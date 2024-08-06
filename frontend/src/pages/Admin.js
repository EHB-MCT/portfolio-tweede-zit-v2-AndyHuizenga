import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


const ChannelPage = () => {
  const { channelNumber } = useParams();
  const [channelContent, setChannelContent] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/content/${channelNumber}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.json();
        setChannelContent(content);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, [channelNumber]);

  return (
    <div style={{ padding: '20px' }}>
      {channelContent ? (
        <div className="channel-content">
          <h2>{channelContent.title}</h2>
          {channelContent.descriptions.content.map((item, index) => {
            if (item.nodeType === 'heading-1') {
              return <h1 key={index}>{item.content[0].value}</h1>;
            } else if (item.nodeType === 'heading-3') {
              return <h3 key={index}>{item.content[0].value}</h3>;
            } else if (item.nodeType === 'heading-6') {
              return <h6 key={index}>{item.content[0].value}</h6>;
            } else if (item.nodeType === 'paragraph') {
              return <p key={index}>{item.content[0].value}</p>;
            } else {
              return null;
            }
          })}
          {channelContent.content.map((asset, index) => (
            <img
              key={index}
              src={asset.fields.file.url}
              alt={asset.fields.title}
              style={{ maxWidth: '100%' }}
            />
          ))}
        </div>
      ) : (
        <p>Loading content...</p>
      )}
    </div>
  );
};

export default ChannelPage;
