import React from 'react';
import PropTypes from 'prop-types';
import styles from '../css/AuthorSelector.module.css'; // Import the CSS module

const AuthorSelector = ({ authors, onSelectAuthor, selectedAuthorIndex }) => {
  return (
    <div className={styles.authorSelect}>
      {authors.map((author, index) => (
        <div
          key={index}
          className={`${styles.authorOption} ${selectedAuthorIndex === index ? styles.selected : ''}`}
          onClick={() => onSelectAuthor(author, index)}
        >
          <img
            src={author.profilePictureUrl || '/path/to/default-image.jpg'}
            alt={author.name}
            className={styles.authorImage}
          />
          <div className={styles.authorName}>{author.name}</div>
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