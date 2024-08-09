import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import '../../css/CreateAuthorPage.css';

const CreateAuthorPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    profilePicture: '', // This should hold the profile picture ID
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      profilePicture: e.target.files[0]
    }));
  };

  const handleProfilePictureUpload = async () => {
    const file = formData.profilePicture;
    if (!file) {
      setError('Please select a profile picture to upload.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const uploadData = new FormData();
    uploadData.append('content', file); // Use the key 'content' to match your existing routes

    try {
      const response = await axios.post('http://localhost:3001/api/content/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success && response.data.fileIds && response.data.fileIds.length > 0) {
        setFormData(prevState => ({
          ...prevState,
          profilePicture: response.data.fileIds[0] // Store the profile picture ID
        }));
        setUploadedFileName(file.name);
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

    const { name, relationship, profilePicture } = formData;

    try {
      const response = await axios.post('http://localhost:3001/api/content/createAuthor', {
        name,
        relationship,
        profilePicture // Use profilePicture instead of profilePictureId
      });

      if (response.data.success) {
        setSuccess(`Author created successfully! Code: ${response.data.code}`);
        // Reset form fields
        setFormData({
          name: '',
          relationship: '',
          profilePicture: '', // Reset profilePicture to an empty string
        });
        setUploadedFileName('');
        // Clear any previous error messages
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

      <Form>
        <Form.Group controlId="formProfilePicture">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
          {uploadedFileName && <p>Selected file: {uploadedFileName}</p>}
        </Form.Group>

        <Button
          type="button"
          onClick={handleProfilePictureUpload}
          variant="primary"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Profile Picture'}
        </Button>
        
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formRelationship">
          <Form.Label>Relationship</Form.Label>
          <Form.Control
            as="select"
            name="relationship"
            value={formData.relationship}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Relationship</option>
            <option value="Family">Family</option>
            <option value="Doctor">Doctor</option>
            <option value="Friends">Friends</option>
          </Form.Control>
        </Form.Group>

        <Button
          type="submit"
          onClick={handleSubmit}
          variant="primary"
          disabled={loading || !formData.profilePicture}
        >
          {loading ? 'Submitting...' : 'Create Author'}
        </Button>
      </Form>
    </div>
  );
};

export default CreateAuthorPage;
