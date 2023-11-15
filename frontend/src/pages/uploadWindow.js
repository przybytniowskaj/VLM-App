import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CloseIcon from '@mui/icons-material/Close';


import ImageDropzone from '../components/ImageDropzone';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const UploadFromDevice = () => {
    const [loading, setLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
  
    const handleDrop = async (acceptedFiles) => {
        setLoading(true);
    
        try {
          const formData = new FormData();
          formData.append('image', acceptedFiles[0]);
    
          // Upload the image file
          const response = await axios.post('http://127.0.0.1:8000/api/classifier/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          // Handle the response if needed
          console.log('Image uploaded successfully:', response.data);
    
          // Simulate an API call duration
          setTimeout(() => {
            setUploadedFiles(acceptedFiles);
            setLoading(false);
          }, 2000);
        } catch (error) {
          console.error('Error uploading image:', error);
          setLoading(false);
        }
      };
    
    const handleSearch = () => {
        // Handle search logic, e.g., fetch image URLs
        setLoading(true);
        // Simulate fetching image URLs (replace with actual logic)
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      };
  
    return (
        <Box>
      <ImageDropzone onDrop={handleDrop} />
      {loading && <LinearProgress variant="indeterminate" />}
      {uploadedFiles.length > 0 && (
        <Box>
          <Typography variant="subtitle1" color="textSecondary" mt={2}>
            Files Uploaded:
          </Typography>
          <ul>
            {uploadedFiles.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </Box>
      )}
      <TextField label="Type a phrase" variant="outlined" fullWidth />
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '10px' }}
        onClick={handleSearch}
      >
        Search
      </Button>
    </Box>
    );
  };
  
  const UploadFromCatalog = () => (
      <h3>Upload from Catalog</h3>
  );


 const PopupWindow = ({ isOpen, onRequestClose, initialTab }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
  
    const handleTabChange = (_, newValue) => {
      setActiveTab(newValue);
    };
  
    useEffect(() => {
      setActiveTab(initialTab);
      Modal.setAppElement(document.body);
    }, [initialTab]);

    return (
        <Modal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          style={{
            content: {
              backgroundColor: 'rgb(30,30,30)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70%',
              height: '80%',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            },
          }}
        >
            <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="Upload from Device" icon={<CloudUploadIcon />} />
                <Tab label="Upload from Catalog" icon={<PhotoLibraryIcon />} />
            </Tabs>
            <CloseIcon style={{ cursor: 'pointer', position: 'absolute', top: '20px', right: '20px' }} onClick={onRequestClose}/>          
            {activeTab === 0 && <UploadFromDevice />}
            {activeTab === 1 && <UploadFromCatalog />}
        </Modal>
      );
    };

  export default PopupWindow;

  {/*<Box>
        <Box {...getRootProps()} style={{width: '100%', minHeight: '100px', border: '2px dashed #bdbdbd', borderRadius: '4px', display: 'flex',
                                          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', cursor: 'pointer', marginTop: '3em'}}>
          <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
        </Box>
        <LinearProgress variant="determinate" value={50} />
        <TextField label="Type a phrase" variant="outlined" fullWidth />
        <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
          Search
        </Button>
      </Box>*/}