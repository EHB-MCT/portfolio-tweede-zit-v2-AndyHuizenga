import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import styles from '../../css/CreateAuthorPage.module.css'; // Updated import for CSS Module
import API_BASE_URL from "../config";

const CreateAuthorPage = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    profilePicture: '',
    email: '',
    contactnumber: '',
    description: '',
    bday: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/assets`);
        setThumbnails(response.data);
      } catch (error) {
        console.error('Error fetching thumbnails:', error);
      }
    };
    fetchThumbnails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prevState => ({
      ...prevState,
      profilePicture: files
    }));
    setUploadedFileNames(files.map(file => file.name));
  };

  const handleProfilePictureUpload = async () => {
    const files = formData.profilePicture;
    if (!files.length) {
      setError('Please select a profile picture to upload.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const uploadData = new FormData();
    files.forEach(file => uploadData.append('content', file));

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success && response.data.fileIds && response.data.fileIds.length > 0) {
        setFormData(prevState => ({
          ...prevState,
          profilePicture: response.data.fileIds[0]
        }));
        setSuccess('Profile picture uploaded successfully!');
        setIsUploaded(true);
      } else {
        setError('Failed to upload profile picture.');
      }
    } catch (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      setError('Failed to upload profile picture.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { name, relationship, profilePicture, email, contactnumber, description, bday } = formData;

    try {
      const response = await axios.post(`${API_BASE_URL}/createAuthor`, {
        name,
        relationship,
        profilePicture,
        email,
        contactnumber,
        description,
        bday
      });

      if (response.data.success) {
        setSuccess(`Author created successfully! Code: ${response.data.code}`);
        setFormData({
          name: '',
          relationship: '',
          profilePicture: '',
          email: '',
          contactnumber: '',
          description: '',
          bday: ''
        });
        setUploadedFileNames([]);
        setIsUploaded(false);
        setError('');
      } else {
        setError('Failed to create author.');
      }
    } catch (error) {
      console.error('Error creating author:', error);
      setError('Failed to create author.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.createAuthorPage} ${darkMode ? styles.darkMode : ''}`}>
      <h2 className={styles.title}>Create New Author</h2>

      {loading && <Spinner animation="border" className={styles.spinner} />}
      {uploading && <Spinner animation="border" className={styles.spinner} />}
      {success && !uploading && <Alert variant="success" className={styles.alert}>{success}</Alert>}
      {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}

      <Form className={styles.createAuthorForm}>
        <div className={styles.fileUploadContainer}>
          <Form.Group controlId="formContentFile" className={styles.fileInput}>
            <Form.Label className="sr-only">Upload Content File</Form.Label>
            <Form.Control
              type="file"
              name="content"
              onChange={handleFileChange}
              multiple
              required
              className={styles.fileInputControl}
            />
          </Form.Group>
          <div className={styles.fileNames}>
            {uploadedFileNames.join(', ')}
          </div>
        </div>

        <div className={styles.formFields}>
          <Form.Group controlId="formName" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={styles.formControl}
            />
          </Form.Group>

          <Form.Group controlId="formRelationship" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>Relationship</Form.Label>
            <Form.Control
              as="select"
              name="relationship"
              value={formData.relationship}
              onChange={handleInputChange}
              required
              className={styles.formControl}
            >
              <option value="">Select Relationship</option>
              <option value="Family">Family</option>
              <option value="Doctor">Doctor</option>
              <option value="Friends">Friends</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formEmail" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={styles.formControl}
            />
          </Form.Group>

          <Form.Group controlId="formContactNumber" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>Contact Number</Form.Label>
            <Form.Control
              type="text"
              name="contactnumber"
              value={formData.contactnumber}
              onChange={handleInputChange}
              className={styles.formControl}
            />
          </Form.Group>

          <Form.Group controlId="formDescription" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className={styles.descriptionTextarea}
            />
          </Form.Group>

          <Form.Group controlId="formBday" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>Birthday</Form.Label>
            <Form.Control
              type="date"
              name="bday"
              value={formData.bday}
              onChange={handleInputChange}
              className={styles.formControl}
            />
          </Form.Group>
        </div>

        <Button
          variant={isUploaded ? 'success' : 'primary'}
          onClick={isUploaded ? handleSubmit : handleProfilePictureUpload}
          disabled={loading || uploading || (!isUploaded && !formData.profilePicture.length)}
          className={styles.uploadButton}
        >
          {isUploaded ? 'Submit' : 'Upload Content'}
        </Button>
      </Form>
    </div>
  );
};

export default CreateAuthorPage;