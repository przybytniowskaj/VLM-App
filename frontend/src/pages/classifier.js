import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { useTheme } from '@mui/material';
import { Box, TextField, Button, Grid, LinearProgress, Typography } from '@mui/material';


import Header from '../layout/Header';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import UploadWindowCaptioning from './uploadWindowCaptioning';

const CopyButton = ({ text, onSelect, onDeselect, selected }) => {
  const theme = useTheme();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    onSelect(); // Notify parent component that this button is selected
    // alert(`Text "${text}" is copied to the clipboard!`);
  };

  const handleDeselect = () => {
    setIsCopied(false);
    onDeselect(); // Notify parent component that this button is deselected
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      backgroundColor={theme.palette.background.paper}
      style={{
        textAlign: 'center',
        color: 'white',
        userSelect: 'all',
        border: isCopied ? '2.5px solid white' : '1px solid darkgrey',
        textTransform: 'none', 
        padding:"3%"
      }}
      onClick={isCopied ? handleDeselect : handleCopyClick}
    >
      {text}
    </Button>
  );
};

const Classifier = () => {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [caption, setCaption] = useState(null);
  const [initialTab, setInitialTab] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false); 
  const [generatedText, setGeneratedText] = useState([]);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [userSuggestion, setUserSuggestion] = useState('');



  const handleUserSuggestionChange = (event) => {
    setUserSuggestion(event.target.value);
  };

  const handleSelect = (index) => {
    setSelectedIndexes((prevSelected) => [...prevSelected, index]);
  };

  const handleDeselect = (index) => {
    setSelectedIndexes((prevSelected) =>
      prevSelected.filter((selectedIndex) => selectedIndex !== index)
    );
  };

  const handleSave = () => {
    if (selectedIndexes.length === 1 && userSuggestion === '') {
      saveAs(files[0], generatedText[selectedIndexes[0]].replace(/\s+/g, '_'));
    } else if (selectedIndexes.length === 0 && userSuggestion !== '') {
      saveAs(files[0], userSuggestion);
    } else if (selectedIndexes.length === 0 && userSuggestion === '') {
      saveAs(files[0], generatedText[0].replace(/\s+/g, '_'));
    } else {
      alert('Please select only one title or your suggestion.');
    }
  }

  const loadImage = (files) => {
    setTimeout(() => {
      setFiles(files);
      setCaption('');
      setSelectedIndexes([]);
      setUserSuggestion("");
      if (setFiles.length) {
        setIsLoading(false);
      }
    }, 1000);
  };

  const sendData = () => {

    if (files.length === 0) {
      alert('Please upload a photo first :)');
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', files[0], files[0].name);
    uploadPhoto(files[0].name)

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

  const uploadPhoto = async (file) => {
    const userToken = localStorage.getItem('Token');
  
    if (!userToken) {
      console.error('User not authenticated');
      return;
    }
  
    try {
      const formData = new FormData();
      
      const prefix = "http://127.0.0.1:8000/media/images/";
      const prefixedFilePath = file.startsWith(prefix) ? file : `${prefix}${file}`;
      formData.append('uploaded_photos', prefixedFilePath);
  
      const response = await fetch('http://127.0.0.1:8000/auth/user-profile/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${userToken}`,
        },
        body: formData,
      });
  
      if (response.status === 200) {
        const data = await response.json();
        console.log('Uploaded photos updated successfully:', data.message);
      } else {
        const errorData = await response.json();
        console.error('Error updating uploaded photos:', errorData.error);
      }
    } catch (error) {
      console.error('An error occurred while uploading photo:', error);
    }
  };

  const getClassificationResult = (obj) => {
    axios
      .get(`http://127.0.0.1:8000/api/classifier/${obj.data.id}/`, {
        headers: {
          accept: 'application/json',
        },
      })
      .then((response) => {
        setCaption(response);
        setGeneratedText(response.data.result.match(/'([^']+)'/g).map(str => str.slice(1, -1)));
        setImagePath(response.data.image);
      })
      .catch((err) => console.log(err));

    setIsLoading(false);
  };

  const openModal = (tab) => {
    setGeneratedText([]);
    setInitialTab(tab);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSaveToCSV = () => {
    if (selectedIndexes.length === 0 && userSuggestion === '') {
      alert('Please select at least one title or provide your own');
      return;
    }

    const feedbackData = [];
    selectedIndexes.forEach(index => {
        feedbackData.push({
            image_path: files[0].path || files[0].name.split('/').pop(),  
            caption: generatedText[index],
        });
    });
    if (userSuggestion !== '') {
      feedbackData.push({
          image_path: files[0].path  || files[0].name.split('/').pop(),
          caption: userSuggestion,
      });
    }
    feedbackData.forEach(data => {
      axios.post('http://127.0.0.1:8000/api/user-caption-choices/', data)
          .then(console.log("Feedback submitted with success"))
          .catch(error => {
              console.error('Error submitting feedback:', error);
          });
  });
};
  
  return (
    <>
      <Header title='Image Captioning' />
      <Box
        backgroundColor={theme.palette.background.default}
        paddingTop={15}
        flexDirection="column"
      > 
      <Grid container spacing={4} style={{ height: '85vh' }}>

        <Grid item xs={12} md={4} position="fixed" style={{ height: '80%', width: '100%', marginTop:"-0.5%"}}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              height="80%"
            >
              <Button variant="contained" color="primary" onClick={() => openModal(0)} style={{ width: '80%', height: '30%', margin: '6% auto', flexGrow: 1 }}>
                <Typography variant='h6' style={{fontSize: '18px'}} >Upload photos from device</Typography>
              </Button>
              <Button variant="contained" color="primary" onClick={() => openModal(1)} style={{ width: '80%', height: '30%', margin: '6% auto', flexGrow: 1 }}>
                <Typography variant='h6' style={{fontSize: '18px'}}>Choose photos from catalog</Typography>
              </Button>
            </Box>
          </Grid>
        
        <Grid item container xs={12} md={8} marginLeft={"35%"} position="fixed">
          <Grid container alignItems={'center'} style={{ height: '100%', width: '95%'}} >
            <Grid
              item
              container
              spacing={3}
              xs={12}
            >
              <Grid item xs={12} marginTop={-5} >
                {isLoading && (
                  <Box  style={{ width: '100%' }}>
                    <LinearProgress color='success' />
                  </Box>
                )}
              </Grid>
            </Grid>
          {!caption ?(
            <Box flex="1"
            display="flex"
            flexDirection="column"
            alignItems="center"
            padding={3}
            >
            <Box 
                alignItems='center'
                position='relative'
                fullWidth
                height="55vh"
                bgcolor={theme.palette.background.paper}
                padding={2}
                marginBottom={3}>
                {files.length > 0 && (
                <img
                  src={files.length > 0 ? URL.createObjectURL(files[0]) : ''}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
                )}
                { files.length == 0 && (
                  <img
                    src={`https://images.unsplash.com/photo-1600354279787-0a726615ef44?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRvZ3MlMjBpbiUyMGZvcmVzdHxlbnwwfHwwfHx8MA%3D%3D`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </Box>
              <Button
                variant='contained'
                color='primary'
                size='large'
                disableElevation={true}
                onClick={sendData}
                sx={{
                  padding: '1em 1.5em',
                  fontSize: '1.1em',
                  '&:hover': {
                    border: `0.8px solid white`,
                  },
                }}
              >
                Generate Caption
              </Button>
            </Box>
          )
          :
          (
            <Grid container spacing={0} style={{ height: '100%' }} marginTop={-1}>
            <Grid item container xs={8} md={3} position="fixed" style={{ height: '100%'}}>
              <Box 
              display="flex"
              flexDirection="column"
              alignItems="center" 
              padding={2}  
              height="70vh"     
              >
              <Box 
                  alignItems='center'
                  justifyContent='space-between'
                  position='relative'
                  height="90%"
                  bgcolor={theme.palette.background.paper}
                  padding={2}
                  marginBottom={3}
                >
                  <img
                    src={URL.createObjectURL(files[0])}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'}}
                  />
                </Box>
                <Button
                  variant='contained'
                  color='primary'
                  size='large'
                  disableElevation={true}
                  onClick={sendData}
                  sx={{
                    padding: '1em 1.5em',
                    fontSize: '1.1em',
                    '&:hover': {
                      border: `0.8px solid white`,
                    },
                  }}
                >
                  Generate Caption
                </Button>
              </Box>
            </Grid>
            <Grid item container xs={8} md={5} marginLeft={"28%"} position="fixed" style={{ height: '100%'}} >
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="space-evenly" width="80%" height="68%" >
                <CopyButton
                  text={<span style={{ fontSize: '16px' }}>
                  {capitalizeFirstLetter(generatedText[0])}
                </span>}
                  onSelect={() => handleSelect(0)}
                  onDeselect={() => handleDeselect(0)}
                  selected={selectedIndexes.includes(0)}
                />
                <CopyButton
                  text={<span style={{ fontSize: '16px' }}>
                  {capitalizeFirstLetter(generatedText[1])}
                </span>}
                  onSelect={() => handleSelect(1)}
                  onDeselect={() => handleDeselect(1)}
                  selected={selectedIndexes.includes(1)}
                />
                <CopyButton
                  text={<span style={{ fontSize: '16px' }}>
                  {capitalizeFirstLetter(generatedText[2])}
                </span>}
                  onSelect={() => handleSelect(2)}
                  onDeselect={() => handleDeselect(2)}
                  selected={selectedIndexes.includes(2)}
                />
                <CopyButton
                  text={<span style={{ fontSize: '16px' }}>
                  {capitalizeFirstLetter(generatedText[3])}
                </span>}
                  onSelect={() => handleSelect(3)}
                  onDeselect={() => handleDeselect(3)}
                  selected={selectedIndexes.includes(3)}
                />
                <CopyButton
                  text={<span style={{ fontSize: '16px' }}>
                  {capitalizeFirstLetter(generatedText[4])}
                </span>}
                  onSelect={() => handleSelect(4)}
                  onDeselect={() => handleDeselect(4)}
                  selected={selectedIndexes.includes(4)}
                />
                <TextField
                  label="Type your suggestion"
                  variant="outlined"
                  fullWidth
                  value={userSuggestion}
                  onChange={handleUserSuggestionChange}
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    border: '0.1px solid white',
                    borderRadius: '5px',
                    backgroundColor: 'transparent',
                  }}
                  InputProps={{
                    style: {
                      color: 'white',
                      fontSize: '16px'
                    },
                  }}
                />
              <Box  display="flex" justifyContent="space-between" fullWidth marginBottom={-3}> 
                <Button variant='contained' sx={{padding: '0.7em 1.3em', fontSize: '1.1em', '&:hover': { border: `0.8px solid white`},}} size='large'
                         color='primary' onClick={handleSave} style={{textTransform: 'none' }} >
                  Save image with new filename
                </Button>
                <Button></Button>
                <Button variant='contained' sx={{padding: '0.7em 1.3em', fontSize: '1.1em', '&:hover': { border: `0.8px solid white`},}} size='large'
                         color='primary' onClick={handleSaveToCSV} style={{textTransform: 'none' }}>
                  Submit your feedback
                </Button>
              </Box>
                </Box>
            </Grid>
            </Grid>
          )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <UploadWindowCaptioning 
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        initialTab={initialTab}
        onDrop={loadImage}
      />
    </>
  );
};

export default Classifier;