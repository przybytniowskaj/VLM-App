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

import ClassifierButtons from '../components/ClassifierButtons';
import ImageDropzone from '../components/ImageDropzone';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const UploadFromDevice = ({submitOnClick, onDrop, closeModal}) => {
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
      setFiles(files);
      setImage(null);
      setIsLoading(false);
      loadImage(files);
      onDrop(files);
    };

    

    const loadImage = (files) => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
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
            <Grid item xs={12}>
                  <Box
                    display='flex'
                    flexDirection='row'
                    alignItems='center'
                    justifyContent='center'
                    padding={6}
                    paddingTop={1}
                  >
                    {files.length > 0 && !isLoading &&(
                      <Box flex='1' color={'white'} >
                      <Typography variant="h6" style={{ marginBottom: '1em'}}>
                        Loaded image:
                    </Typography>

                      <Box flexDirection = 'row'>
                      <Box flex="1" height="300px" marginLeft={2} style={{ border: '10px solid white' }}>
                        <img
                        src={URL.createObjectURL(files[0])}
                        alt={files[0].name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            margin: 0,
                            padding: 0,
                            background: 'white',
                        }}
                        /> 
                        </Box>
                        <Box>
                        <ul style={{ listStyleType: 'none', padding: 0, columns: `${Math.min(3, files.length)}` }}>
                        {files.map((file, index) => (
                          
                          <li key={index} style={{ marginBottom: '1em', textAlign: 'center' }}>
                            {file.name}
                          </li>
                        ))}
                      </ul>
                      </Box>
                    
                    </Box>
                    </Box>
                    
                    )}
                    <Box
                        display='flex'
                        flexDirection='row'
                        alignItems='flex-start'
                        justifyContent='center'
                        padding={6}
                        paddingTop={1}
                    >
                    <Box flex="0.95" height="auto">
                    <ImageDropzone onDrop={handleDrop} />
                    </Box>
                    </Box>
                  </Box>
                  
                    <Box alignItems={'center'} 
                    flexDirection='row' 
                    justifyContent='center' 
                    display='flex'>
                    {files.length > 0 && !isLoading && (                       
                        <Button
                        variant='contained'
                        color='primary'
                        size='large'
                        alignItems = 'center'
                        disableElevation={true}
                        onClick={closeModal}
                        sx={{
                        fontSize: '18px',
                        border: '1px solid transparent',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            color: theme.palette.primary.main,
                            border: `2px solid ${theme.palette.primary.main}`,
                        },
                        }}
                    >
                        Submit image
                    </Button>
                    )}
                    </Box>
                    
                  
            </Grid>
        </Grid>
        
    );
  };
  
  const UploadFromCatalog = () => (
      <h3>Upload from Catalog</h3>
  );


 const PopupWindow = ({ isOpen, onRequestClose, initialTab, onDrop }) => {
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
            {activeTab === 0 && <UploadFromDevice onDrop={onDrop} closeModal = {onRequestClose}/>}
            {activeTab === 1 && <UploadFromCatalog />}
        </Modal>
      );
    };

  export default PopupWindow;
