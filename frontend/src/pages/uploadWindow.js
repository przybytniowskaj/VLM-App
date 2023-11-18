import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

import ImageDropzone from '../components/ImageDropzone';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const UploadFromDevice = () => {
    const theme = useTheme();
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [textInputValue, setTextInputValue] = useState('');

  const handleTextChange = (event) => {
    setTextInputValue(event.target.value);
    };

    const handleDrop = (files) => {
      setIsLoading(true);
      setFiles(files);
      setImage(null);
      loadImage(files);
      // Read each file and update imageUrls
    };

    const loadImage = (files) => {
      setTimeout(() => {
        setFiles(files);
        if (setFiles.length) {
          setIsLoading(false);
        }
        setImage(null);
      }, 3000);
    };
  
    const sendData = () => {
      setFiles([]);
      setIsLoading(true);
  
      const formData = new FormData();
      formData.append('image', files[0], files[0].name);
      formData.append('text', textInputValue);
  
      axios
        .post('http://127.0.0.1:8000/api/classifier/', formData, {
          headers: {
            accept: 'application/json',
            'content-type': 'multipart/form-data',
          },
        })
        .then((response) => {
          getClassificationResult(response);
        })
        .catch((err) => console.log(err));
    };
  
    const getClassificationResult = (obj) => {
      axios
        .get(`http://127.0.0.1:8000/api/classifier/${obj.data.id}/`, {
          headers: {
            accept: 'application/json',
          },
        })
        .then((response) => {
          setImage(response);
        })
        .catch((err) => console.log(err));
  
      setIsLoading(false);
    };
  
    const classifyAnother = () => {
      setImage(null);
    };
    
  
    return ( 
        <Grid container spacing={3}>
          <Grid
            item
            container
            alignItems='center'
            justifyContent='space-between'
            marginTop='-40px'
            spacing={3}
            xs={12}
            padding={6}
          >
            
          </Grid>
          <Grid item xs={12}>
            {isLoading && (<LinearProgress color='success' data-aos='zoom-out'/> )}
          </Grid>
          {!image && (
            <Grid item xs={12}>
                  <Box
                    display='flex'
                    flexDirection='row'
                    alignItems='flex-start'
                    justifyContent='center'
                  >
                    <Box flex="0.95" height="auto">

                    <ImageDropzone onDrop={handleDrop} />
                    </Box>
                  </Box>
                  <Box padding={4} fullWidth>
                    <TextField
                      label=" Type description for desired photos..."
                      variant="outlined"
                      border={1}
                      borderRadius={1}
                      borderColor={theme.palette.divider}
                      value={textInputValue}
                      fullWidth
                      onChange={handleTextChange}
                    />
                  </Box>
              
                  <Box
                    display='flex'
                    flexDirection='row'
                    alignItems='flex-start'
                    justifyContent='center'
                    padding={6}
                    paddingTop={1}
                  >
                    {files.length > 0 && (
                      <Box flex='1' color={'white'} >
                      Loaded images:
                        <ul style={{ listStyleType: 'none', padding: 0, columns: `${Math.min(3, files.length)}` }}>
                        {files.map((file, index) => (
                          <li key={index} style={{ marginBottom: '1em', textAlign: 'center' }}>
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </Box>
                    )}
                  </Box>
                  <Button variant="contained" color="primary" style={{ marginTop: '10px' }} onClick={sendData}>
                    Search
                  </Button>
            </Grid>
          )}
          
        </Grid>
        
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
      </Box>
      
      
      Box>
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
      */}