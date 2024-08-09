import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import '../../css/CreateAuthorPage.css'; // Ensure this path is correct for your project

const CreateAuthorPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    profilePicture: '', // This should hold the profile picture ID
    email: '',
    contactnumber: '',
    description: '',
    bday: '' // Add field for birthdate
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
    setUploadedFileName(e.target.files[0].name); // Display the selected file name
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
    uploadData.append('content', file);

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
        profilePicture, // Use profilePicture ID
        email,
        contactnumber,
        description,
        bday // Include birthdate field
      });

      if (response.data.success) {
        setSuccess(`Author created successfully! Code: ${response.data.code}`);
        // Reset form fields
        setFormData({
          name: '',
          relationship: '',
          profilePicture: '', // Reset profilePicture to an empty string
          email: '',
          contactnumber: '',
          description: '',
          bday: '' // Reset birthdate field
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

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formContactNumber">
          <Form.Label>Contact Number</Form.Label>
          <Form.Control
            type="text"
            name="contactnumber"
            value={formData.contactnumber}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBday">
          <Form.Label>Birthdate</Form.Label>
          <Form.Control
            type="date"
            name="bday"
            value={formData.bday}
            onChange={handleInputChange}
          />
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
