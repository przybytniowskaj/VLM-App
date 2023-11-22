import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme } from '@mui/material';

import GenerateCaption from '../components/GenerateCaption';
import Header from '../layout/Header';
import replaceUnderscore from '../utils/replaceUnderscore';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import Typography from '@mui/material/Typography';
import UploadWindowCaptioning from './uploadWindowCaptioning';

const Classifier = () => {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [files2, setFiles2] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [initialTab, setInitialTab] = useState(0);
  const [textInputValue, setTextInputValue] = useState('');
  const [isModalOpen, setModalOpen] = useState(false); 
  const [isSubmitted, setIsSubmitted] = useState(false);



  const handleDrop = (files) => {
    setIsLoading(true);
    setFiles(files);
    setImage(null);
    loadImage(files);
  };

  const handleImageUpload = (uploadedFiles) => {
    setFiles(uploadedFiles);
    setFiles2(uploadedFiles)
    loadImage(uploadedFiles);
    // You may want to call sendData() here if you want to automatically send the data
    // sendData();
  };

  const handleRemove = () => {
    setFiles([]);
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

    if (files.length === 0) {
      alert('Please upload a photo first :)');
      return;
    }
    setFiles([]);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', files[0], files[0].name);
    console.log(formData);

    axios
      .post('http://127.0.0.1:8000/api/classifier/', formData, {
        headers: {
          accept: 'application/json',
          'content-type': 'multipart/form-data',
        },
      })
      .then((response) => {
        getClassificationResult(response);
        submitOnClick(response, files); 
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

  const openModal = (tab) => {
    setInitialTab(tab);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  
  const handleTextChange = (event) => {
    setTextInputValue(event.target.value);
  };

  

  return (
    <>
      <Header title='Image Captioning' />
      <Box
        backgroundColor={theme.palette.background.default}
        paddingTop={15}
        flexDirection="column"
      > 
      <Grid container spacing={4} style={{ height: '80vh' }}>
        <Grid item xs={12} md={4} position="fixed" style={{ height: '60%', width: '100%', marginTop: '5%'}}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              height="80%"
            >
              <Button variant="contained" color="primary" onClick={() => openModal(0)} style={{ width: '80%', height: '40%', margin: '2% auto', flexGrow: 1 }}>
                <Typography variant='h6'>Upload photos from device</Typography>
              </Button>
              <Button variant="contained" color="primary" onClick={() => openModal(1)} style={{ width: '80%', height: '40%', margin: '2% auto', flexGrow: 1 }}>
                <Typography variant='h6'>Choose photos from catalog</Typography>
              </Button>
            </Box>
          </Grid>
        
          
        <Grid item container xs={12} md={8} marginLeft={"35%"} position="fixed">
        
          <Grid container alignItems={'center'} style={{ height: '100%', width: '95%'}} >
            <Grid
              item
              container
              alignItems='center'
              justifyContent='space-between'
              spacing={3}
              xs={12}
            >
              
              <Grid item xs={12} marginTop={2}>
                {isLoading && (
                  <Box  style={{ width: '100%' }}>
                    <LinearProgress color='success' />
                  </Box>
                )}
              </Grid>
            </Grid>
            

            <Box
              flex="1"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
              padding={2}
            >
              
            {image ? (
              <>
              <Box 
            alignItems='center'
            justifyContent='space-between'
            position='relative'
            height="50vh"
            padding={2}>
                    <img
                src={files2.length > 0 ? URL.createObjectURL(files2[0]) : ""}
                alt={files2[0]?.name || "Uploaded Image"}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
                    </Box>
                    <Box color={theme.palette.text.secondary}
                     marginBottom={2} >
                    <GenerateCaption classificationResult={capitalizeFirstLetter(
                    replaceUnderscore(image.data.result)
                  )}/>
                   </Box>
            </> 
            )
            : (
              
              <>
              <Box>
              <Box 
              alignItems='center'
              justifyContent='space-between'
              position='relative'
              fullWidth
              height="50vh"
              bgcolor={theme.palette.background.paper}
              padding={2}>
              {files.length > 0 && (
              <img
                src={files2.length > 0 ? URL.createObjectURL(files2[0]) : ""}
                alt={files2[0]?.name || "Uploaded Image"}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              /> )}
              </Box>
              <Box color={theme.palette.text.secondary} marginBottom={2} >
                <GenerateCaption classificationResult="" />
              </Box>
              </Box>
              
            </>
            )
            }
            </Box>
            
            <Box
               position='fixed'
               top='80%'
               left='60%'
             >
              <Button
                variant='contained'
                color='primary'
                size='large'
                disableElevation={true}
                onClick={sendData}
                sx={{
                  padding: '1em 1.5em',
                  fontSize: '1.3em',
                  '&:hover': {
                    border: `1px solid white`,
                  },
                }}
              >
                Generate Caption
              </Button>
              
      </Box>
    
            
          </Grid>
          
        </Grid>
       
        </Grid>
      </Box>
      
      <UploadWindowCaptioning 
      submitOnClick = {sendData}
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        initialTab={initialTab}
        onDrop={handleImageUpload}
         />
    </>
  );
};

export default Classifier;