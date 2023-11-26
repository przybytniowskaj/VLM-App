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
    alert(`Text "${text}" is copied to the clipboard!`);
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
        border: isCopied ? '1.5px solid white' : '1px solid darkgrey',
        margin: '2%',
        textTransform: 'none',  
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
  const [generatedText, setGeneratedText] = useState("");
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
    } else if (selectedIndexes.length === 0 && userSuggestion == '') {
      saveAs(files[0], generatedText[0].replace(/\s+/g, '_'));
    } else {
      alert('Please select only one title or your suggestion.');
    }
  }

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
        setGeneratedText(response.data.result.match(/'([^']+)'/g).map(str => str.slice(1, -1)));
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

  const handleSaveToCSV = () => {
    // TODO: Implement CSV export with selectedIndexes
    console.log('Selected Indexes:', selectedIndexes);
    console.log(userSuggestion);
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
          {!caption ?(
            <Box flex="1"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"      
            >
            <Box 
                alignItems='center'
                justifyContent='space-between'
                position='relative'
                fullWidth
                height="55vh"
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
            <>
            <Grid item container xs={8} md={3} position="fixed" marginTop={"28%"}>
              <Box flex="1"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"          
              >
              <Box 
                  alignItems='center'
                  justifyContent='space-between'
                  position='relative'
                  height="60vh"
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
            <Grid item container xs={8} md={5} marginLeft={"28%"} position="fixed" marginTop={"28%"}>
            <Box color={theme.palette.text.secondary} marginBottom={2} width="80%" alignItems={'center'} padding={1} >
            <CopyButton
              text={capitalizeFirstLetter(generatedText[0])}
              onSelect={() => handleSelect(0)}
              onDeselect={() => handleDeselect(0)}
              selected={selectedIndexes.includes(0)}
            />
            <CopyButton
              text={capitalizeFirstLetter(generatedText[1])}
              onSelect={() => handleSelect(1)}
              onDeselect={() => handleDeselect(1)}
              selected={selectedIndexes.includes(1)}
            />
            <CopyButton
              text={capitalizeFirstLetter(generatedText[2])}
              onSelect={() => handleSelect(2)}
              onDeselect={() => handleDeselect(2)}
              selected={selectedIndexes.includes(2)}
            />
            <CopyButton
              text={capitalizeFirstLetter(generatedText[3])}
              onSelect={() => handleSelect(3)}
              onDeselect={() => handleDeselect(3)}
              selected={selectedIndexes.includes(3)}
            />
            <CopyButton
              text={capitalizeFirstLetter(generatedText[4])}
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
                border: '0.5px solid white',
                borderRadius: '5px',
                margin: '2%',
                backgroundColor: 'transparent', // Adjust the selected state style
              }}
            />
            <Box display="flex" justifyContent="space-between" fullWidth > 
  <Button variant='contained' color='primary' onClick={handleSave} style={{textTransform: 'none'}}>
    Save image with new filename
  </Button>
  <Button variant="contained" color="primary" onClick={handleSaveToCSV} style={{textTransform: 'none'}}>
    Submit your feedback
  </Button>
</Box>
      {/* <>
  {[0, 1, 2, 3, 4].map((index) => (
    <CopyButton
      key={index}
      text={capitalizeFirstLetter(replaceUnderscore(generatedText[index]))}
      onSelect={() => handleSelect(index)}
          isSelected={selectedIndex === index}
    />
  ))}
</> */}
                </Box>
            </Grid>
            </>
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