import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Tabs, Tab, useTheme, Grid, LinearProgress, TextField, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CloseIcon from '@mui/icons-material/Close';

import ImageDropzone from '../components/ImageDropzone';

const UploadFromDevice = ({ closeModal, sendDataToMainPage }) => {
    const theme = useTheme();
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [textInputValue, setTextInputValue] = useState('');
    
    const handleTextChange = (event) => {
      setTextInputValue(event.target.value);
    };

    const handleDrop = (files) => {
      setFiles(files);
    };

    const handleEnterKeyPress = (event) => {
      if (event.key === 'Enter') {
        setFiles(files);
        sendData();
      }
    };
  
    const sendData = async () => {
      setIsLoading(true);
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i], files[i].name);
      }
      formData.append('query', textInputValue);

    axios({
          method: 'post',
          url: 'http://127.0.0.1:8000/api/semanticimagesearch/semantic_image_search/',
          data: formData
      }).then(function (response) {
        setIsLoading(false);
        sendDataToMainPage(response.data);
        closeModal();
      }).catch(function (error) {
          console.log(error);
          setIsLoading(false);
      })
    };

    return ( 
        <Grid container>
          <Grid item xs={12} padding={4}>
            {isLoading && (<LinearProgress color='success' data-aos='zoom-out'/> )}
          </Grid>
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
                label=" Type key word for photos and press enter"
                variant="outlined"
                border={theme.palette.divider}
                value={textInputValue}
                fullWidth
                onChange={handleTextChange}
                onKeyDown={handleEnterKeyPress}
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
              {files.length > 0 &&(
              <Box flex='1' color={'white'} >
                Uploaded images:
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
          </Grid>
        </Grid>
    );
  };
  
  const UploadFromCatalog = () => (
      <h3>Upload from Catalog</h3>
  );


 const PopupWindow = ({ isOpen, onRequestClose, initialTab, sendDataToMainPage }) => {
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
            {activeTab === 0 && <UploadFromDevice closeModal={onRequestClose} sendDataToMainPage={sendDataToMainPage}/>}
            {activeTab === 1 && <UploadFromCatalog />}
        </Modal>
      );
    };

  export default PopupWindow;
