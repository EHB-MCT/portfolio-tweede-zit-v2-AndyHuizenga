import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import '../../css/CreateAuthorPage.css';

const CreateAuthorPage = () => {
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
      const response = await axios.post('http://localhost:3001/api/content/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success && response.data.fileIds && response.data.fileIds.length > 0) {
        setFormData(prevState => ({
          ...prevState,
          profilePicture: response.data.fileIds
        }));
        setSuccess('Profile picture uploaded successfully!');
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
      const response = await axios.post('http://localhost:3001/api/content/createAuthor', {
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
    <div className="create-author-page">
      <h2>Create New Author</h2>

      {loading && <Spinner animation="border" />}
      {uploading && <Spinner animation="border" />}
      {success && !uploading && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form className="create-author-form">
        <div className="file-upload-container">
          <Form.Group controlId="formContentFile" className="file-input">
            <Form.Label className="sr-only">Upload Content File</Form.Label>
            <Form.Control
              type="file"
              name="content"
              onChange={handleFileChange}
              multiple
              required
              className="file-input-control"
            />
          </Form.Group>
          <div className="file-names">
            {uploadedFileNames.join(', ')}
          </div> 
          <Button
            type="button"
            onClick={handleProfilePictureUpload}
            disabled={uploading}
            className="upload-button"
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>

        <div className="form-fields">
          <Form.Group controlId="formName" className="form-group">
            <Form.Label className="form-label">Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formRelationship" className="form-group">
            <Form.Label className="form-label">Relationship</Form.Label>
            <Form.Control
              as="select"
              name="relationship"
              value={formData.relationship}
              onChange={handleInputChange}
              required
              className="form-control"
            >
              <option value="">Select Relationship</option>
              <option value="Family">Family</option>
              <option value="Doctor">Doctor</option>
              <option value="Friends">Friends</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formEmail" className="form-group">
            <Form.Label className="form-label">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formContactNumber" className="form-group">
            <Form.Label className="form-label">Contact Number</Form.Label>
            <Form.Control
              type="text"
              name="contactnumber"
              value={formData.contactnumber}
              onChange={handleInputChange}
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formDescription" className="form-group">
            <Form.Label className="form-label">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="description-textarea"
            />
          </Form.Group>

          <Form.Group controlId="formBday" className="form-group">
            <Form.Label className="form-label">Birthday</Form.Label>
            <Form.Control
              type="date"
              name="bday"
              value={formData.bday}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </Form.Group>
        </div>

        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Creating...' : 'Create Author'}
        </Button>
      </Form>
    </div>
  );
};

export default CreateAuthorPage;
