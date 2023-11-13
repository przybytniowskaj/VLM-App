import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme, useMediaQuery } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import HeroButtons from '../components/HeroButtons';
import Button from '@mui/material/Button';

const Hero = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <Box height='850px' position={'flex'}
      sx={{
        backgroundImage: `url(https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        backgroundSize: '100% 110%',        
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }}
    >

    
    <Box
      maxWidth={{ sm: 7120, md: 11236 }}
      width={1}
      margin='0 auto'
      paddingTop={10}
      //backgroundColor={theme.palette.background.default}
      >
      <Grid container spacing={4} marginTop='20px'>
        <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
          <Box data-aos={isMd ? 'fade-right' : 'fade-up'}>
            <Box marginBottom={2}>
              <Typography
                align='center'
                variant='h1'
                //color={theme.palette.text.primary}
                marginTop='20%'
              >
                A dive into Visual-Language Model
              </Typography>
            </Box>
            <Box marginBottom={3}>
              <Typography
                align='center'
                color={theme.palette.text.secondary}
                variant='h4'
                paddingTop={3}
                paddingBottom={3}
                marginBottom='15px'
              >
                Tu bym dala opis czym sa VLMs
              </Typography>
            </Box>
            <HeroButtons />
          </Box>
        </Grid>
        <Grid
          item
          container
          alignItems='center'
          justifyContent='center'
          xs={12}
          md={6}
          sx={{ order: { xs: 1, md: 2 } }}
        >
          <Box
            sx={{
              height: { xs: 'auto', md: 1 },
              '& img': {
                objectFit: 'cover',
              },
              '& .lazy-load-image-loaded': {
                height: 1,
                width: 1,
              },
            }}
          >
            {/*<Box
              component={LazyLoadImage}
              src={'/images/img1.jpg'}
              alt='Hero'
              effect='blur'
              height={{ xs: 'auto', md: 1 }}
              maxHeight={{ xs: 300, md: 1 }}
              width={1}
              maxWidth={1}
              borderRadius={2}
            />*/}
          </Box> 
        </Grid>
        
        
      </Grid>
      
      
    </Box>
    <Grid item
          container
          alignItems='center'
          justifyContent='center'
          xs={30}
          md={'100%'}
          sx={{ order: { xs: 1, md: 1 } }}>
      <Box
        data-aos='fade-up'
        padding={30}
      >
          <Button
            component='a'
            variant='outlined'
            color='primary'
            size='large'
            href='/#description'
            fullWidth={isMd ? false : true}
            disableElevation={true}
            sx={{
              flexDirection: 'column',
              alignItems: 'center',
              padding: '18px 34px',
              marginRight: '15px',
              fontSize: '20px',
              border: `2px solid transparent`,
              //backgroundColor: `${theme.palette.background.paper}`,
              color: 'white',
              '&:hover': {
                backgroundColor: `${theme.palette.background.paper}`,
                color: theme.palette.common.white,
                border: `2px solid ${theme.palette.primary.main}`,
              },
            }}
          >
           Choose the task
          <KeyboardArrowDownIcon style={{ fontSize: '2rem' }} />
          </Button>
                   
      </Box>
      </Grid>
    </Box>
  );
};

export default Hero;
