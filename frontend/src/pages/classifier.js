import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material';
import { Box, TextField, Button, Grid, LinearProgress, Typography } from '@mui/material';

import Header from '../layout/Header';
import replaceUnderscore from '../utils/replaceUnderscore';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import UploadWindowCaptioning from './uploadWindowCaptioning';


const Classifier = () => {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [caption, setCaption] = useState(null);
  const [initialTab, setInitialTab] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false); 
  const [generatedText, setGeneratedText] = useState("");

  const loadImage = (files) => {
    setTimeout(() => {
      setFiles(files);
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
        setCaption(response);
        setGeneratedText(capitalizeFirstLetter(replaceUnderscore(response.data.result)));
      })
      .catch((err) => console.log(err));

    setIsLoading(false);
  };

  const openModal = (tab) => {
    setGeneratedText("");
    setInitialTab(tab);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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
              <Grid item xs={12} marginTop={-5} >
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
              marginTop={-2}
            >
              {caption ? (
                <>
                <Box 
                  alignItems='center'
                  justifyContent='space-between'
                  position='relative'
                  height="55vh"
                  padding={2}
                >
                  <img
                    src={URL.createObjectURL(files[0])}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'}}
                  />
                </Box>
              </> 
              )
              : 
              (
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
                </Box>
              </>
              )}
                <Box color={theme.palette.text.secondary} marginBottom={2} width="500px" alignItems={'center'} padding={2}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={generatedText}
                    readOnly
                    disabled
                    InputProps={{style: { color: 'white', fontWeight: 'bold' }}}
                  />
                </Box>
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
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        initialTab={initialTab}
        onDrop={loadImage}
      />
    </>
  );
};

export default Classifier;