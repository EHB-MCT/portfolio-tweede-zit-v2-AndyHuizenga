import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert, Row, Col, Dropdown } from 'react-bootstrap';
import '../css/Admin.css'; // Import custom CSS for better styling

const AdminForm = () => {
  const [channels, setChannels] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [contentTypes, setContentTypes] = useState(['video', 'image']);
  const [formData, setFormData] = useState({
    channel: '',
    title: '',
    date: '',
    content: '',
    contentType: '',
    description: '',
    authorId: '', // Updated to authorId
    thumbnailId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchChannelsAndAuthors = async () => {
      try {
        const availableChannelsResponse = await axios.get('http://localhost:3001/api/content/availableChannels');
        const authorsResponse = await axios.get('http://localhost:3001/api/content/authors');
        setChannels(availableChannelsResponse.data);
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

  const handleDropdownSelect = (authorId) => {
    setFormData(prevState => ({
      ...prevState,
      authorId // Update authorId directly
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      const data = {
        ...formData,
        content: [formData.content], // Ensure content is an array
      };
  
      const response = await axios.post('http://localhost:3001/api/content/createEntry', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      setSuccess('Recall item successfully created!');
      setFormData({
        channel: '',
        title: '',
        date: '',
        content: '',
        contentType: '',
        description: '',
        authorId: '', // Reset authorId
        thumbnailId: '' // Reset thumbnailId
      });
    } catch (error) {
      setError('Failed to create recall item.');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form">
      <h2>Create New Recall Item</h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
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
          <Col md={6}>
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
        </Row>
        <Row>
          <Col md={6}>
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
          <Col md={6}>
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
        <Form.Group controlId="formContent">
          <Form.Label>Content ID (Video/Image)</Form.Label>
          <Form.Control
            type="text"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Enter content ID"
            required
          />
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formAuthor">
          <Form.Label>Author</Form.Label>
          <Dropdown onSelect={handleDropdownSelect}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {formData.authorId ? 
                authors.find(author => author.id === formData.authorId)?.name || 'Select Author' 
                : 'Select Author'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {authors.map(author => (
                <Dropdown.Item
                  key={author.id} // Use the author ID as the key
                  eventKey={author.id} // Use author ID as the eventKey
                >
                  {author.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>

        <Form.Group controlId="formThumbnail">
          <Form.Label>Thumbnail ID (Optional)</Form.Label>
          <Form.Control
            type="text"
            name="thumbnailId"
            value={formData.thumbnailId}
            onChange={handleInputChange}
            placeholder="Enter thumbnail ID"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AdminForm;
