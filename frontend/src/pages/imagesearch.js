import React, { useState } from 'react';
import axios from 'axios';
import { Button, Box, Grid, LinearProgress, Typography, TextField, useTheme } from '@mui/material';

import Header from '../layout/Header';
import CustomModal from './uploadWindow';

const Classifier = () => {
  const theme = useTheme();
  const [textInputValue, setTextInputValue] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState(0); 
  const [result, setResult] = useState(null);
  const [images, setImages] = useState(null);
  const [features, setFeatures] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [secondSearch, setSecondSearch] = useState(false);
  const [firstSearch, setFirstSearch] = useState(true);
  const [flickr, setFlickr] = useState(null);
  const [sentData, setSentData] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [resultFull, setResultFull] = useState(null);
  const defaultPhotos = [ `https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D`,
                          `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhdmVsfGVufDB8fDB8fHww`,
                          `https://plus.unsplash.com/premium_photo-1677343210638-5d3ce6ddbf85?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhdmVsfGVufDB8fDB8fHww`,
                          `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzN8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D`,
                          `https://plus.unsplash.com/premium_photo-1675484743423-57da4e8011c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dHJhdmVsfGVufDB8fDB8fHww`,
                          `https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D`,
                        ]

  const openModal = (tab) => {
    setInitialTab(tab);
    setTextInputValue("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const setToDefault = () => {
    setFirstSearch(true);
    setSecondSearch(false);
  };

  const fetchFlickrData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/get_flickr_images/');
      const flickrImages = await response.json();
      setFlickr(flickrImages);     
    } catch (error) {
      console.error('Error fetching Flickr images:', error);
    }
  };

  const handleTextChange = (event) => {
    setTextInputValue(event.target.value);
    if (!secondSearch && firstSearch) { 
      fetchFlickrData();  
      setFirstSearch(false);    
    }
  };

  const setSearch = () => {
    setSecondSearch(true);
    sendDataToMainPage();
  };

  const sendDataToMainPage = () => {
    
    axios.get(`http://127.0.0.1:8000/api/semanticimagesearch/get_semantic_image_search`, {
        headers: {
          accept: 'application/json',
        },
      }).then((response) => {
        // console.log(secondSearch);
        setTextInputValue(response.data.query);
        setResult(response.data.result.split(',').map((item) => parseInt(item.trim(), 10)));
        setResultFull(response.data.result_full.split(',').map((item) => parseInt(item.trim(), 10)));
        setImages(response.data.images);
        setFeatures(response.data.image_features)
        setSentData(true);
      })
      .catch((err) => console.log(err));
      setShowSelection(false);
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      setIsLoading(true);
      sendData();
    }
  };

  const sendData = async () => {

    const formData = new FormData();
    if (secondSearch) {
      for (let i = 0; i < images.length; i++) {
        const imageFileName = images[i].image;
        const response = await fetch(`http://127.0.0.1:8000/${imageFileName}`);
        const imageBlob = await response.blob();
        const imageFile = new File([imageBlob], imageFileName, { type: 'image/*' });
        formData.append('images', imageFile);
      }
    } else {
      for (const imageURL of flickr) {
        const response = await fetch(`http://127.0.0.1:8000${imageURL}`);
        const imageBlob = await response.blob();
        const imageFile = new File([imageBlob], imageURL.split('/').pop(), { type: 'image/*' });
        formData.append('images', imageFile);
      }    
      formData.append('flickr_flag', true);
    }
    console.log(features);
    formData.append('image_features', JSON.stringify(features));
    formData.append('query', textInputValue);

    axios({
          method: 'post',
          url: 'http://127.0.0.1:8000/api/semanticimagesearch/semantic_image_search/',
          data: formData
      }).then(function (response) {
        setIsLoading(false);
        sendDataToMainPage(response);

      }).catch(function (error) {
          console.log(error);
          setIsLoading(false);
      })
  };

  const displayBest = () => {
    setShowSelection(true);
  };

  const handleSubmission = async () => {
    const feedbackData = [];
    selectedImages.forEach(index => {
      const imageFileName = images[index].image.split('/').pop();
          feedbackData.push({
              image_path: imageFileName,  
              phrase: textInputValue,
          });
      });
    feedbackData.forEach(data => {
        axios.post('http://127.0.0.1:8000/api/user-search-choices/', data)
            .then(console.log("Feedback submitted with success"))
            .catch(error => {
                console.error('Error submitting feedback:', error);
            });
    });

    setShowSelection(false);
    setSelectedImages([]);
  };

  const handleImageSelect = (index) => {
    if (selectedImages.includes(index)) {
      setSelectedImages(selectedImages.filter((selectedIndex) => selectedIndex !== index));
    } else {
      setSelectedImages([...selectedImages, index]);
    }
  };


  return (
    <>
    <Header title='Semantic Image Search' />
    <Box
      backgroundColor={theme.palette.background.default}
      marginTop={10}
    >
      <Grid container spacing={4} style={{ height: '80vh' }}>
      
        <Grid item xs={12} md={4} position='fixed' style={{ width:'100%', height: '75%', marginTop: '4%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <TextField
            label="Type phrase and press enter"
            variant="outlined"
            style={{ width: '80%', marginBottom:'5%', color:'white' }}
            value={textInputValue}
            onChange={handleTextChange}
            onKeyDown={handleEnterKeyPress}
          />
          <Button variant="contained" disableElevation={true} color="primary" onClick={() => openModal(0)} style={{ width: '80%', height: '40%', margin: '4% auto', flexGrow: 1 }}>
            <Typography variant='h6'>Upload photos from device</Typography>
          </Button>
          <Button variant="contained" color="primary" onClick={() => openModal(1)} style={{ width: '80%', height: '40%', margin: '4% auto', flexGrow: 1 }}>
            <Typography variant='h6'>Choose photos from catalog</Typography>
          </Button>
          <Button variant="contained" color="primary" onClick={setToDefault} style={{ width: '80%', height: '40%', margin: '4% auto', flexGrow: 1 }}>
            <Typography variant='h6'>Search from Flickr images</Typography>
          </Button>
          {sentData && !showSelection && (<Button variant="contained" color="primary" onClick={displayBest} style={{ width: '50%', height: '20%', margin: '4% auto', flexGrow: 1 }}>
            <Typography variant='h6'>Choose best matches</Typography>
          </Button>)}
          {sentData && showSelection && (<Button variant="contained" color="primary" onClick={handleSubmission} style={{ width: '50%', height: '20%', margin: '4% auto', flexGrow: 1 }}>
            <Typography variant='h6'>Submit your feedback</Typography>
          </Button>)}
        </Grid>
        <Grid item container xs={12} md={8} style={{ marginLeft:'35%' }}>
          <Box  style={{ width: '85%', marginBottom: '1%'}}>
            {isLoading && (<LinearProgress color='success' />)}
          </Box>
          <Grid container spacing={1} style={{ height: '85vh',width:'90%', alignItems: 'center', justifyContent: 'center' }}>
            {!result && (defaultPhotos.map((photo, index) => (    
            
              <Grid item key={index} sm={6} md={4} lg={4} alignItems={'center'} align-content='flex-start' style={{ marginBottom: '2px' }}>
              <a href={photo} target="_blank" rel="noopener noreferrer">
                <img
                  src={photo}
                  alt={`Image ${index + 1}`}
                  style={{ width: '75%', height: '75%', objectFit: 'cover' }}
                />
              </a>
            </Grid>
            )))}  
            {result && showSelection && (resultFull.map((index) => (
              <Grid item key={index} sm={6} md={4} lg={4} alignItems={'center'} align-content='flex-start' padding={5} style={{ marginBottom: '2%' }}>
                <div
                  onClick={() => handleImageSelect(index)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <img
                      src={`http://127.0.0.1:8000/${images[index].image}`}
                      alt={`Image ${index + 1}`}
                      style={{
                        width: '100%', // Ensure the image takes up the full width of the container
                        height: '100%',
                        display: 'block',
                      }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      border: selectedImages.includes(index) ? '5px solid #00A86B' : 'none',
                    }}
                  />
                </div>
              </Grid>
            )))}
            {result && !showSelection &&( result.map((index) => (
              <Grid item key={index} sm={6} md={4} lg={4} alignItems={'center'} align-content='flex-start' padding={5} style={{ marginBottom: '2%' }}>
                <div style={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <a href={`http://127.0.0.1:8000/${images[index].image}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`http://127.0.0.1:8000/${images[index].image}`}
                      style={{ width: '100%', height: '100%', display: 'block', }}
                    />
                  </a>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  />
                </div>
              </Grid>
            )))}  
          </Grid>
        </Grid>
      </Grid>
      </Box>
      <CustomModal isOpen={isModalOpen} onRequestClose={closeModal} initialTab={initialTab} setSearch={setSearch}/>
      </>
  );
};

export default Classifier;
