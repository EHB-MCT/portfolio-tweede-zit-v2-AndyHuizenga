import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import AuthorSelector from '../../components/AuthorSelector'; // Import the AuthorSelector component
import '../../css/AdminUpload.css';

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
    author: null,
    thumbnailId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedAuthorIndex, setSelectedAuthorIndex] = useState(null);

  useEffect(() => {
    const fetchAuthorsAndAssets = async () => {
      try {
        const authorsResponse = await axios.get('http://localhost:3001/api/content/authors');
        const authorsData = authorsResponse.data;

        const assetsResponse = await axios.get('http://localhost:3001/api/content/assets');
        const assetsData = assetsResponse.data;

        const assetsMap = assetsData.reduce((map, asset) => {
          map[asset.sys.id] = asset.fields.file['en-US'].url;
          return map;
        }, {});

        const authorsWithImages = authorsData.map(author => ({
          ...author,
          profilePicture: assetsMap[author.profilePicture]
        }));

        setAuthors(authorsWithImages);
      } catch (error) {
        console.error('Error fetching authors or assets:', error);
        setError('Failed to fetch authors or assets.');
      }
    };

    const fetchChannels = async () => {
      try {
        const channelsResponse = await axios.get('http://localhost:3001/api/content/availableChannels');
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
  };

  const handleAuthorSelect = (author, index) => {
    console.log('Author clicked:', author); // Log the selected author object
    setSelectedAuthorIndex(index); // Use index to track selected author
    setFormData(prevState => ({
      ...prevState,
      author: author // Store the whole author object
    }));
    console.log('Updated FormData with Author:', author); // Log the updated form data
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

      const uploadResponse = await axios.post('http://localhost:3001/api/content/upload', formDataForUpload, {
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

    if (formData.contentType === 'video') {
      contentToSend = formData.content.filter(file => !file.name.match(/\.(jpg|jpeg|png|gif)$/i));
    }

    if (selectedAuthorIndex === null || !formData.thumbnailId) {
      setError('Author and Thumbnail must be selected.');
      setLoading(false);
      return;
    }

    const selectedAuthor = authors[selectedAuthorIndex];
    const requestData = {
      channel: channelInt,
      title: formData.title,
      date: formData.date,
      content: contentToSend,
      contentType: formData.contentType,
      description: formData.description,
      author: {
        sys: {
          type: "Link",
          linkType: "Entry",
          id: selectedAuthor.code // Use unique code or identifier here
        }
      },
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
        content: [],
        contentType: '',
        description: '',
        author: null,
        thumbnailId: ''
      });
      setSelectedAuthorIndex(null);
      setUploadedFileNames([]);
      setIsUploaded(false);
      document.getElementById('formContentFile').value = '';
    } catch (error) {
      console.error('Error submitting form:', error);
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
    </div>
  );
};

export default AdminForm;
