import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form } from 'react-bootstrap';

const VerificationModal = ({ show, handleClose, onVerify, author }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleCodeChange = (e) => setCode(e.target.value);
  const handleVerify = () => {
    console.log("Entered Code:", code); // Log the code entered by the user
    console.log("Expected Code:", author.code); // Log the expected code for the author
  
    if (author && code.toString() === author.code.toString()) {
      console.log("Verification successful for author:", author); 
      onVerify();
      handleClose();
    } else {
      console.log("Verification failed for author:", author);
      setError('Incorrect code. Please try again.');
    }
    
  };
  

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Verify Author: {author ? author.name : 'Unknown'}</Modal.Title> {/* Handle undefined author */}
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formVerificationCode">
          <Form.Label>Enter Verification Code</Form.Label>
          <Form.Control
            type="text"
            value={code}
            onChange={handleCodeChange}
            placeholder="Enter code"
          />
          {error && <Form.Text className="text-danger">{error}</Form.Text>}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleVerify}>
          Verify
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

VerificationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onVerify: PropTypes.func.isRequired,
  author: PropTypes.object, // Make this prop optional to handle undefined cases
};

export default VerificationModal;
