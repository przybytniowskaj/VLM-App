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


const Classifier = () => {
  const theme = useTheme();
  const [imageUrls, setImageUrls] = useState([]);

 
  const [isModalOpen, setModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState(0); 

  const openModal = (tab) => {
    setInitialTab(tab);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
    <Header title='Semantic Image Search' />
    <Box
        backgroundColor={theme.palette.background.default}
        paddingTop={10}
      >
      <Grid container spacing={4} style={{ height: '80vh' }}>
      <Grid item xs={12} md={4} style={{ height: '60%', marginTop: '8%'}}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
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
        <Grid container spacing={2} style={{ width: '90%'}}>
              {Array.from({ length: 9 }, (_, index) => (
                <Grid item key={index} xs={8} sm={3} md={4} >
                  <Card>
                    <CardContent>
                      <img
                        src={imageUrls}
                        alt={`Image ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
        </Grid>
        
        
      </Grid>
      
      </Box>
      <Spacer sx={{ pt: 6 }} />

      <CustomModal isOpen={isModalOpen} onRequestClose={closeModal} initialTab={initialTab} />
      </>
  );
};

export default Classifier;
