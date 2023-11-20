import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Head from 'next/head';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { modalUnstyledClasses, useTheme } from '@mui/material';

import GenerateCaption from '../components/GenerateCaption';
import ImageDropzone from '../components/ImageDropzone';
import ClassifierButtons from '../components/ClassifierButtons';
import ClassifierHeader from '../components/ClassifierHeader';
import ClassifierResult from '../components/ClassifierResult';
import ClassifyAgain from '../components/ClassifyAgain';
import Spacer from '../components/Spacer';
import replaceUnderscore from '../utils/replaceUnderscore';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import Typography from '@mui/material/Typography';
import Header from '../layout/Header';
import CustomModal from './uploadWindow';
import TextField from '@mui/material/TextField';


const Classifier = () => {
  const theme = useTheme();
  const [textInputValue, setTextInputValue] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState(0); 
  const [result, setResult] = useState(null);
  const [images, setImages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const defaultPhotos = [`https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D`,
  `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhdmVsfGVufDB8fDB8fHww`,
                           `https://plus.unsplash.com/premium_photo-1677343210638-5d3ce6ddbf85?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhdmVsfGVufDB8fDB8fHww`,
                           `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzN8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D`,
                           `https://plus.unsplash.com/premium_photo-1675484743423-57da4e8011c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dHJhdmVsfGVufDB8fDB8fHww`,
                          `https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D`,
                        ]

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

  const sendDataToMainPage = (data) => {
    axios.get(`http://127.0.0.1:8000/api/semanticimagesearch/get_semantic_image_search`, {
        headers: {
          accept: 'application/json',
        },
      }).then((response) => {
        setTextInputValue(response.data.query);
        setResult(response.data.result.split(',').map((item) => parseInt(item.trim(), 10)));
        setImages(response.data.images);
        })
        .catch((err) => console.log(err));
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendData();
    }
  };

  const sendData = async () => {
    setIsLoading(true);

    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i], images[i].name);
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
    <>
    <Header title='Semantic Image Search' />
    <Box
        backgroundColor={theme.palette.background.default}
        paddingTop={10}
      >
      <Grid container spacing={4} style={{ height: '80vh' }}>
      <Grid item xs={12} md={4} style={{ height: '60%', marginTop: '8%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <TextField
      label="Type key word for photos and press enter"
      variant="outlined"
      style={{ width: '80%', marginBottom: '20px' }}
      value={textInputValue}
      onChange={handleTextChange}
      onKeyDown={handleEnterKeyPress}
    />
    <Grid item xs={4}>
            {isLoading && (<LinearProgress color='success' data-aos='zoom-out'/> )}
          </Grid>
              <Button variant="contained" color="primary" onClick={() => openModal(0)} style={{ width: '80%', height: '40%', margin: '20px auto', flexGrow: 1 }}>
                <Typography variant='h6'>Upload photos from device</Typography>
              </Button>
              <Button variant="contained" color="primary" onClick={() => openModal(1)} style={{ width: '80%', height: '40%', margin: '20px auto', flexGrow: 1 }}>
                <Typography variant='h6'>Choose photos from catalog</Typography>
              </Button>
          </Grid>
        <Grid item container xs={12} md={8} >
        <Grid container spacing={1} style={{ height: '80vh',width:'90%', marginTop:'1vh', alignItems: 'center', justifyContent: 'center' }}>
        {!result && (defaultPhotos.map((photo, index) => (    
        
           <Grid item key={index} sm={6} md={4} lg={4} alignItems={'center'} align-content='flex-start' style={{ marginBottom: '2px' }}>
          <a href={photo} target="_blank" rel="noopener noreferrer">
            <img
              src={photo}
              alt={`Image ${index + 1}`}
              style={{ width: '70%', height: '70%', objectFit: 'cover' }}
            />
          </a>
        </Grid>
        )))}  
        {result && ( 
            result.map((index) => (
              <Grid item key={index} sm={6} md={4} lg={4} alignItems={'center'} align-content='flex-start' style={{ marginBottom: '2px' }}>
                <a href={`http://127.0.0.1:8000/${images[index].image}`} target="_blank" rel="noopener noreferrer">
                  <img
                    src={`http://127.0.0.1:8000/${images[index].image}`}
                    alt={`Image ${index + 1}`}
                    style={{ width: '90%', height: '90%', objectFit: 'cover' }}
                  />
                </a>
              </Grid>
            ))
          )}
        </Grid>
        </Grid>
        
        
      </Grid>
      
      </Box>
      <Spacer sx={{ pt: 6 }} />

      <CustomModal isOpen={isModalOpen} onRequestClose={closeModal} initialTab={initialTab}  sendDataToMainPage={sendDataToMainPage}/>
      </>
  );
};

export default Classifier;
