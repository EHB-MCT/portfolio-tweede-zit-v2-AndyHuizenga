import React from 'react';
import { Container } from 'react-bootstrap';
import styles from '../../css/InfoPage.module.css'; // Assuming you have a CSS file for styling

const InfoPages = () => {
  const user = {
    name: 'Christine',
    age: 67,
    picture: '/path/to/christine-picture.jpg', // Replace with actual image path
  };

  return (
    <Container className={styles.infoPage}>
      <h1>User Information</h1>

      {/* User Info */}
      <div className={styles.userInfo}>
        <img src={user.picture} alt={user.name} className={styles.userPicture} />
        <p>Name: {user.name}</p>
        <p>Age: {user.age}</p>
      </div>
    </Container>
  );
};

export default InfoPages;