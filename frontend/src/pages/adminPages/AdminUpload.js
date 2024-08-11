import API_BASE_URL from "../config";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import AuthorSelector from '../../components/AuthorSelector'; // Import the AuthorSelector component
import '../../css/AdminUpload.css';
import VerificationModal from '../../components/VerificationModal'; // Import the VerificationModal


const AdminForm = () => {
  const [channels, setChannels] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [contentTypes] = useState(['video', 'album']);
  const [formData, setFormData] = useState({
    channel: '',
    title: '',
    date: '',
    content: [],
    contentType: '',
    description: '',
    author: '',
    thumbnailId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedAuthorIndex, setSelectedAuthorIndex] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingAuthor, setPendingAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthorsAndAssets = async () => {
      try {
        const authorsResponse = await axios.get(`${API_BASE_URL}/authors`);
        setAuthors(authorsResponse.data);
      } catch (error) {
        console.error('Error fetching authors:', error);
        setError('Failed to fetch authors.');
      }
    };

    const fetchChannels = async () => {
      try {
        const channelsResponse = await axios.get(`${API_BASE_URL}/availableChannels`);
        setChannels(channelsResponse.data);
      } catch (error) {
        console.error('Error fetching channels:', error);
        setError('Failed to fetch channels.');
      }
    };

    fetchAuthorsAndAssets();
    fetchChannels();
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
    setUploadedFileNames(files.map(file => file.name));
    setIsUploaded(false);
  
    console.log("Selected Files:", files); // Log the selected files
  };

  const uploadContent = async () => {
    if (!formData.content.length) {
      setError('Please select files to upload.');
      return;
    }

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

      const uploadResponse = await axios.post(`${API_BASE_URL}/upload`, formDataForUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadResponse.data.success && Array.isArray(uploadResponse.data.fileIds)) {
        const uploadedFiles = uploadResponse.data.fileIds.map((id, index) => ({
          id: id,
          name: formData.content[index].name
        }));

        setUploadedFileNames(uploadedFiles.map(file => file.name));

        let thumbnailId = uploadedFiles[0].id;
        if (formData.contentType === 'video') {
          const imageFile = uploadedFiles.find(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i));
          thumbnailId = imageFile ? imageFile.id : thumbnailId;
        }

        setFormData(prevState => ({
          ...prevState,
          content: uploadedFiles,
          thumbnailId: thumbnailId
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

  const handleAuthorSelect = (author, index) => {
    setPendingAuthor({ author, index });
    console.log("Selected Author:", author); // Log the selected author
    setShowVerificationModal(true);
  };
  
  const handleVerifyAuthor = () => {
    if (pendingAuthor) {
      console.log("Verifying Author:", pendingAuthor.author); // Log the author being verified
      setSelectedAuthorIndex(pendingAuthor.index);
      setFormData(prevState => ({
        ...prevState,
        author: pendingAuthor.author
      }));
    }
    handleCloseModal();
  };
  

  const handleCloseModal = () => {
    setShowVerificationModal(false);
    setPendingAuthor(null);
  };


  
  const handleThumbnailSelect = (e) => {
    const selectedFileId = e.target.value;
    setFormData(prevState => ({
        ...prevState,
        thumbnailId: selectedFileId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    const channelInt = parseInt(formData.channel, 10);
    let contentToSend = formData.content;
  
    // Filter out non-video files if contentType is 'video'
    if (formData.contentType === 'video') {
      contentToSend = formData.content.filter(file => !file.name.match(/\.(jpg|jpeg|png|gif)$/i));
    }
  
    // Validate author and thumbnail selection
    if (selectedAuthorIndex === null || !formData.thumbnailId) {
      setError('Author and Thumbnail must be selected.');
      setLoading(false);
      return;
    }
  
    // Get the selected author from the list
    const selectedAuthor = authors[selectedAuthorIndex];
    
    // Ensure the selected author object has a name
    if (!selectedAuthor || !selectedAuthor.name) {
      setError('Invalid author selected.');
      setLoading(false);
      return;
    }
  
    // Prepare the request data
    const requestData = {
      channel: channelInt,
      title: formData.title,
      date: formData.date,
      content: contentToSend.map(file => ({ sys: { type: "Link", linkType: "Asset", id: file.id } })),
      contentType: formData.contentType,
      description: formData.description,
      authorName: selectedAuthor.name, // Send author's name
      thumbnail: { sys: { type: "Link", linkType: "Asset", id: formData.thumbnailId } }
    };
  
    console.log("Form Data to Send:", requestData);
  
    try {
      // Send request to the backend
      const response = await axios.post(`${API_BASE_URL}/createEntry`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setSuccess('Recall item successfully created!');
      // Reset form and states if needed
    } catch (error) {
      setError('There was a problem creating the recall item. Please try again.');
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
          <AuthorSelector
            authors={authors}
            onSelectAuthor={handleAuthorSelect}
            selectedAuthorIndex={selectedAuthorIndex}
          />
        </Form.Group>

        <Form.Group controlId="formSelectedAuthor">
          <Form.Label>Selected Author</Form.Label>
          <div>
            {selectedAuthorIndex !== null ? (
              <div>
                {authors[selectedAuthorIndex]?.name || 'No author selected'}
              </div>
            ) : (
              <div>No author selected</div>
            )}
          </div>
        </Form.Group>

        <Row>
          <Col md={3}>
            <Form.Group controlId="formChannel">
              <Form.Label>Channel</Form.Label>
              <Form.Control as="select" name="channel" value={formData.channel} onChange={handleInputChange}>
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
                type="date"
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
              <Form.Control as="select" name="contentType" value={formData.contentType} onChange={handleInputChange}>
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
          <Form.Label>Upload Content</Form.Label>
          <Form.Control type="file" multiple onChange={handleFileChange} />
          {uploadedFileNames.length > 0 && (
            <ul>
              {uploadedFileNames.map((fileName, index) => (
                <li key={index}>{fileName}</li>
              ))}
            </ul>
          )}
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </Form.Group>

        {isUploaded && (
          <Form.Group controlId="formThumbnail">
            <Form.Label>Thumbnail</Form.Label>
            <Form.Control as="select" value={formData.thumbnailId} onChange={handleThumbnailSelect}>
              <option value="">Select Thumbnail</option>
              {formData.content.map(file => (
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
          {isUploaded ? 'Submit' : 'Upload Content'}
        </Button>
      </Form>
      {showVerificationModal && (
  <VerificationModal
    show={showVerificationModal}
    handleClose={handleCloseModal}
    onVerify={handleVerifyAuthor}
    author={pendingAuthor ? pendingAuthor.author : undefined} // Pass the author if available
  />
)}


    </div>
  );
};

export default AdminForm;
