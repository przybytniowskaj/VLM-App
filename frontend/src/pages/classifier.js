import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme } from '@mui/material';

import GenerateCaption from '../components/GenerateCaption';
import ImageDropzone from '../components/ImageDropzone';
import ClassifierButtons from '../components/ClassifierButtons';
import ClassifierHeader from '../components/ClassifierHeader';
import ClassifierResult from '../components/ClassifierResult';
import Header from '../layout/Header';
import ClassifyAgain from '../components/ClassifyAgain';
import Spacer from '../components/Spacer';
import replaceUnderscore from '../utils/replaceUnderscore';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import Typography from '@mui/material/Typography';
import UploadWindowCaptioning from './uploadWindowCaptioning';

const Classifier = () => {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
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
        minHeight='100%'
        paddingTop={15}
        paddingBottom={15}
        flexDirection="column"

      > 
      <Grid container spacing={4} style={{ height: '80vh' }}>
        <Grid item xs={12} md={4} style={{ height: '60%', marginTop: '8%'}}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              height="100%"
            >
              <Button variant="contained" color="primary" onClick={() => openModal(0)} style={{ width: '80%', height: '40%', margin: '20px auto', flexGrow: 1 }}>
                <Typography variant='h6'>Upload photos from device</Typography>
              </Button>
              <Button variant="contained" color="primary" onClick={() => openModal(1)} style={{ width: '80%', height: '40%', margin: '20px auto', flexGrow: 1 }}>
                <Typography variant='h6'>Choose photos from catalog</Typography>
              </Button>
            </Box>
          </Grid>
        
          
        <Grid item container xs={12} md={8} >
        
          <Grid container alignItems={'center'} style={{ height: '90%', width: '90%'}} >
            <Grid
              item
              container
              alignItems='center'
              justifyContent='space-between'
              marginTop='-30px'
              spacing={3}
              xs={12}
            >
              
              <Grid item xs={12}>
                {isLoading && (
                  <Box marginBottom={3} marginTop={2} style={{ width: '100%' }}>
                    <LinearProgress color='success' />
                  </Box>
                )}
              </Grid>
            </Grid>
            

            {/* { (
              <Grid item xs={12}>
                    <Box
                      display='flex'
                      flexDirection='row'
                      alignItems='flex-start'
                      justifyContent='center'
                      flex="1"    
                      height="300px"
                      marginLeft={2}
                      bgcolor="white"
                    >
                      {files.length > 0 && (
                  <Box flex="1" height="300px" marginLeft={2}>
                    <img
                      src={URL.createObjectURL(files[0])}
                      alt={files[0].name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                )}
                    </Box>
                
              </Grid>
            )} */}
            <Box
              flex="1"
              height="500px"
              marginLeft={2}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
              border={5}  
              borderColor="white"  
              padding={2}
            >
              
            {image ? (
              
              <>
                
                    <Box 
              alignItems='center'
              justifyContent='space-between'
              position='relative'
              width="500px"
              height="350px"
              bgcolor={'white'}
              marginBottom={2}
              padding={2}>
                    {/* <img
                      src={image.data.image}
                      alt={files[0]?.name || "Uploaded Image"}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    /> */}
                    </Box>
                    <Box color={theme.palette.text.secondary}
                     marginBottom={2} >
                    <GenerateCaption classificationResult={capitalizeFirstLetter(
                    replaceUnderscore(image.data.result)
                  )}/>
                    </Box>
                  
              </>
            ): (
              
              <>
              
              <Box 
              alignItems='center'
              justifyContent='space-between'
              position='relative'
              width="500px"
              height="350px"
              bgcolor={'white'}
              marginBottom={2} 
              padding={2}>
              <img
                src={files.length > 0 ? URL.createObjectURL(files[0]) : ""}
                alt={files[0]?.name || "Uploaded Image"}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
              </Box>
              <Box color={theme.palette.text.secondary} marginBottom={2} >
                <GenerateCaption classificationResult="" />
              </Box>
              
            </>
            )
            }
            </Box>
            
            <Box
               position='fixed'
               top='80%'
               left='50%'
             >
              <Button
                variant='contained'
                color='primary'
                size='large'
                disableElevation={true}
                onClick={sendData}
                sx={{
                  padding: '14px 30px',
                  fontSize: '18px',
                  border: '1px solid transparent',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: theme.palette.primary.main,
                    border: `2px solid ${theme.palette.primary.main}`,
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