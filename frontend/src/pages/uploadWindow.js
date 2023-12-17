import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Tabs, Tab, useTheme, Grid, LinearProgress, TextField, Box, Typography, Button} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CloseIcon from '@mui/icons-material/Close';

import ImageDropzone from '../components/ImageDropzone';

const UploadFromDevice = ({ closeModal, setSearch }) => {
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
        setSearch();
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
                InputProps={{
                  style: { color: 'white' }, 
                }}
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
  
  const UploadFromCatalog = ({ closeModal, setSearch }) => {
    
    const theme = useTheme();
    const [files, setFiles] = useState([]);
    const [catalogImages, setCatalogImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userUploadedPhotos, setUserUploadedPhotos] = useState([]);
    const [textInputValue, setTextInputValue] = useState('');

    




    const handleSelectImage = async (imageFileName) => {
      const newFiles = [];
      for (const fileName of imageFileName) {
        const response = await fetch(fileName);
        const imageBlob = await response.blob();
        const imageFile = new File([imageBlob], fileName, { type: 'image/*' });
        newFiles.push(imageFile);
      }
      setFiles(newFiles);
    };


    const handleTextChange = (event) => {
      setTextInputValue(event.target.value);
    };

    const handleEnterKeyPress = (event) => {
      if (event.key === 'Enter') {
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
      console.log('sswdwss');

    axios({
          method: 'post',
          url: 'http://127.0.0.1:8000/api/semanticimagesearch/semantic_image_search/',
          data: formData
      }).then(function (response) {
        setIsLoading(false);
        setSearch();
        closeModal();
      }).catch(function (error) {
          console.log(error);
          setIsLoading(false);
      })
    };



    const fetchUserUploadedPhotos = async (token) => {
      try {
        const response = await fetch('http://127.0.0.1:8000/auth/user-profile/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          const userData = await response.json();
          console.log('User uploaded photos:', userData.uploaded_photos);
  
          setUserUploadedPhotos(userData.uploaded_photos);
          await handleSelectImage(userData.uploaded_photos);
          
        } else {
          console.error('Failed to fetch user uploaded photos.');
        }
      } catch (error) {
        console.error('An error occurred while fetching user uploaded photos:', error);
      }
    };

    useEffect(() => {
      axios.get('http://127.0.0.1:8000/api/classifier')
        .then(response => {
          setCatalogImages(response.data);
          const userToken = localStorage.getItem('Token');

        if (userToken) {
          fetchUserUploadedPhotos(userToken);
        }
        })
        .catch(error => {
          console.error('Error fetching catalog images:', error);
        });
    }, []);

    return (
      
      <Box>
        <Box padding={4} fullWidth>
              <TextField
                label=" Type key word for photos and press enter"
                variant="outlined"
                border={theme.palette.divider}
                value={textInputValue}
                fullWidth
                onChange={handleTextChange}
                onKeyDown={handleEnterKeyPress}
                InputProps={{
                  style: { color: 'white' }, 
                }}
              />
            </Box>
        <Box>
  {userUploadedPhotos.length > 0 && (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
      <Typography variant="h6" style={{ marginBottom: '1em', color: 'white' , fontWeight: 'bold' }}>
        YOUR PHOTOS:
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', maxWidth: '1000px'}}>
        {userUploadedPhotos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Uploaded Photo ${index + 1}`}
            style={{ cursor: 'pointer', maxWidth: '100%', maxHeight: '100px', margin: '0.5em' , flex: '0 0 calc(1% - 1em)'}}
          />
        ))}
      </div>

    </Box>
  )}
    </Box>
      </Box>
    );
  };


 const PopupWindow = ({ isOpen, onRequestClose, initialTab, setSearch }) => {
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
            {activeTab === 0 && <UploadFromDevice closeModal={onRequestClose} setSearch={setSearch} />}
            {activeTab === 1 && <UploadFromCatalog closeModal={onRequestClose} setSearch={setSearch}/>}
        </Modal>
      );
    };

  export default PopupWindow;
