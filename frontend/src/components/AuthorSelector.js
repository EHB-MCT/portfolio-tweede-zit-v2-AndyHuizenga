import React from 'react';
import PropTypes from 'prop-types';
import '../css/AuthorSelector.css'; // Ensure this path is correct

const AuthorSelector = ({ authors, onSelectAuthor, selectedAuthorIndex }) => {
  return (
    <div className="author-select">
      {authors.map((author, index) => (
        <div
          key={index}
          className={`author-option ${selectedAuthorIndex === index ? 'selected' : ''}`}
          onClick={() => onSelectAuthor(author, index)}
        >
          <img
            src={author.profilePictureUrl || '/path/to/default-image.jpg'}
            alt={author.name}
            className="author-image"
          />
          <div className="author-name">{author.name}</div>
        </div>
      ))}
    </div>
  );
};

AuthorSelector.propTypes = {
  authors: PropTypes.array.isRequired,
  onSelectAuthor: PropTypes.func.isRequired,
  selectedAuthorIndex: PropTypes.number,
};

export default AuthorSelector;
