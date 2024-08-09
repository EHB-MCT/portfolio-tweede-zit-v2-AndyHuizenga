import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import '../css/Admin.css';

const AdminForm = () => {
  const [channels, setChannels] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [contentTypes] = useState(['video', 'album']);
  const [formData, setFormData] = useState({
    channel: '',
    title: '',
    date: '',
    content: [], // Initialize as an array to hold file objects
    contentType: '',
    description: '',
    authorId: '',
    thumbnailId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchChannelsAndAuthors = async () => {
      try {
        const [channelsResponse, authorsResponse] = await Promise.all([
          axios.get('http://localhost:3001/api/content/availableChannels'),
          axios.get('http://localhost:3001/api/content/authors')
        ]);
        setChannels(channelsResponse.data);
        setAuthors(authorsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data.');
      }
    };

    fetchChannelsAndAuthors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setFormData(prevState => ({
      ...prevState,
      content: files
    }));
  };

  const handleAuthorSelect = (authorId) => {
    setFormData(prevState => ({
      ...prevState,
      authorId
    }));
  };

  const uploadContent = async () => {
    if (!formData.content.length) {
      setError('Please select files to upload.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formDataForUpload = new FormData();
      formData.content.forEach(file => {
        formDataForUpload.append('content', file); // Use 'content' to match backend field name
      });

      const uploadResponse = await axios.post('http://localhost:3001/api/content/upload', formDataForUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadResponse.data.success) {
        setFormData(prevState => ({
          ...prevState,
          content: uploadResponse.data.fileIds.map(id => ({ sys: { id } })) // Format content array with IDs
        }));
        setSuccess('Files uploaded and processed successfully!');
      } else {
        setError('Failed to upload files.');
      }
    } catch (uploadError) {
      console.error('Error uploading files:', uploadError);
      setError('Failed to upload files.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const channelInt = parseInt(formData.channel, 10);

    const requestData = {
      channel: channelInt,
      title: formData.title,
      date: formData.date,
      content: formData.content, // Use the formatted content array
      contentType: formData.contentType,
      description: formData.description,
      author: { sys: { id: formData.authorId } },
      thumbnail: { sys: { id: formData.thumbnailId } }
    };

    try {
      console.log('Submitting form data:', requestData);
      const response = await axios.post('http://localhost:3001/api/content/createEntry', requestData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Response received:', response.data);
      setSuccess('Recall item successfully created!');
      setFormData({
        channel: '',
        title: '',
        date: '',
        content: [], // Reset content to an empty array
        contentType: '',
        description: '',
        authorId: '',
        thumbnailId: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to create recall item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form">
      <h2>Create New Recall Item</h2>
      {loading && <Spinner animation="border" />}
      {uploading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formAuthor">
          <Form.Label>Author</Form.Label>
          <div className="author-select">
            {authors.map(author => (
              <div
                key={author.id}
                className={`author-option ${formData.authorId === author.id ? 'selected' : ''}`}
                onClick={() => handleAuthorSelect(author.id)}
              >
                <div className="author-wrapper">
                  <img src={author.profilePicture} alt={author.name} className="author-image" />
                </div>
                <div className="author-name">{author.name}</div>
              </div>
            ))}
          </div>
        </Form.Group>
        <Row>
          <Col md={3}>
            <Form.Group controlId="formChannel">
              <Form.Label>Channel</Form.Label>
              <Form.Control
                as="select"
                name="channel"
                value={formData.channel}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Channel</option>
                {channels.map(channel => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formContentType">
              <Form.Label>Content Type</Form.Label>
              <Form.Control
                as="select"
                name="contentType"
                value={formData.contentType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Content Type</option>
                {contentTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="formContentFile">
          <Form.Label>Upload Content File</Form.Label>
          <Form.Control
            type="file"
            name="content" // This should match the field name in Multer
            onChange={handleFileChange}
            multiple={formData.contentType === 'album'} // Allow multiple files only for albums
            required
          />
        </Form.Group>

        <Button variant="primary" onClick={uploadContent} disabled={uploading}>
          Upload Content
        </Button>
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formThumbnailId">
          <Form.Label>Thumbnail ID</Form.Label>
          <Form.Control
            type="text"
            name="thumbnailId"
            value={formData.thumbnailId}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="success" type="submit" disabled={loading || uploading}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AdminForm;
