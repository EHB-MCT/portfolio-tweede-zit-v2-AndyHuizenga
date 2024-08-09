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
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    const fetchChannelsAndAuthors = async () => {
      try {
        const [channelsResponse, authorsResponse] = await Promise.all([
          axios.get('http://localhost:3001/api/content/availableChannels'),
          axios.get('http://localhost:3001/api/content/authors')
        ]);
        setChannels(channelsResponse.data);
        setAuthors(authorsResponse.data);
        
        // Automatically set the first author as the default author
        if (authorsResponse.data.length > 0) {
          setFormData(prevState => ({
            ...prevState,
            authorId: authorsResponse.data[0].id
          }));
        }
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
    const files = Array.from(e.target.files);
    setFormData(prevState => ({
      ...prevState,
      content: files
    }));
    setUploadedFileNames(files.map(file => file.name)); // Update the file names
    setIsUploaded(false); // Reset the uploaded status when files are selected
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
  
    // Check if the selected content type is 'video' and ensure two files are selected
    if (formData.contentType === 'video' && formData.content.length !== 2) {
      setError('Please upload exactly one video file and one image file for the thumbnail.');
      return;
    }
  
    setUploading(true);
    setError('');
    setSuccess('');
  
    try {
      const formDataForUpload = new FormData();
      formData.content.forEach(file => {
        formDataForUpload.append('content', file);
      });
  
      const uploadResponse = await axios.post('http://localhost:3001/api/content/upload', formDataForUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log('Upload response:', uploadResponse.data);
  
      if (uploadResponse.data.success && Array.isArray(uploadResponse.data.fileIds)) {
        const uploadedFiles = uploadResponse.data.fileIds.map((id, index) => ({
          id: id,
          name: formData.content[index].name // Assuming the file order is maintained
        }));
  
        setUploadedFileNames(uploadedFiles.map(file => file.name)); // Display file names
  
        // Automatically set the thumbnail to the image file if video is selected
        let thumbnailId = uploadedFiles[0].id; // Default to the first file
        if (formData.contentType === 'video') {
          const imageFile = uploadedFiles.find(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i));
          thumbnailId = imageFile ? imageFile.id : thumbnailId;
        }
  
        setFormData(prevState => ({
          ...prevState,
          content: uploadedFiles, // Store uploaded file details in the content array
          thumbnailId: thumbnailId // Automatically set the correct thumbnail
        }));
        setSuccess('Files uploaded and processed successfully!');
        setIsUploaded(true);
      } else {
        setError('Failed to upload files or unexpected response structure.');
      }
    } catch (uploadError) {
      console.error('Error uploading files:', uploadError);
      setError('Failed to upload files.');
    } finally {
      setUploading(false);
    }
  };
  
  

const handleThumbnailSelect = (e) => {
  const selectedFileId = e.target.value;
  setFormData(prevState => ({
      ...prevState,
      thumbnailId: selectedFileId // Set the selected file's ID as the thumbnailId
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');

  const channelInt = parseInt(formData.channel, 10);

  let contentToSend = formData.content;

  if (formData.contentType === 'video') {
    contentToSend = formData.content.filter(file => !file.name.match(/\.(jpg|jpeg|png|gif)$/i));
  }

  const requestData = {
    channel: channelInt,
    title: formData.title,
    date: formData.date,
    content: contentToSend,
    contentType: formData.contentType,
    description: formData.description,
    author: { sys: { id: formData.authorId } },
    thumbnail: {
      sys: {
        type: "Link",
        linkType: "Asset",
        id: formData.thumbnailId
      }
    }
  };

  console.log('Submitting Form Data:', requestData);

  try {
    console.log('Submitting form data:', requestData);
    const response = await axios.post('http://localhost:3001/api/content/createEntry', requestData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Response received:', response.data);
    setSuccess('Recall item successfully created!');

    // Clear the form state and file input field
    setFormData({
      channel: '',
      title: '',
      date: '',
      content: [], // Reset content to an empty array
      contentType: '',
      description: '',
      authorId: authors.length > 0 ? authors[0].id : '', // Reset to the first author
      thumbnailId: ''
    });
    setUploadedFileNames([]); // Clear uploaded file names
    setIsUploaded(false);

    // Clear the file input field
    document.getElementById('formContentFile').value = '';

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
        <div className="file-upload-container">
          <Form.Group controlId="formContentFile" className="file-input">
            <Form.Label>Upload Content File</Form.Label>
            <Form.Control
              type="file"
              name="content" // This should match the field name in Multer
              onChange={handleFileChange}
              multiple// Allow multiple files only for albums
              required
            />
          </Form.Group>
          <div className="file-names">
            {uploadedFileNames.join(', ')}
          </div> 
        </div>
        {isUploaded && formData.content.length > 0 && (
                <Form.Group controlId="formThumbnailSelect">
                    <Form.Label>Select Thumbnail</Form.Label>
                    <Form.Control
                        as="select"
                        name="thumbnail"
                        value={formData.thumbnailId}
                        onChange={handleThumbnailSelect}
                        required
                    >
                        <option value="">Select Thumbnail</option>
                        {formData.content.map((file) => (
                            <option key={file.id} value={file.id}>
                                {file.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
        )}
        
        <Button
          variant={isUploaded ? 'success' : 'primary'}
          onClick={isUploaded ? handleSubmit : uploadContent}
          disabled={loading || uploading || (!isUploaded && !formData.content.length)}
          className="upload-button"
        >
          {isUploaded ? 'Confirm' : 'Upload Content'}
        </Button>
      </Form>
    </div>
  );
};

export default AdminForm;
