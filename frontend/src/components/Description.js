import React from 'react';
import { Box, Container, Grid, Typography, Button, useTheme } from '@mui/material';

const Description = () => {
  const theme = useTheme();

  return (
    <Box
      maxWidth={{ sm: 720, md: 1236 }}
      width={1}
      margin='0 auto'
      paddingTop={2}
      paddingBottom={2}
    >
      <Box
        data-aos='fade-up'
        backgroundColor={theme.palette.background.default}
        paddingTop={4}
      >
        <Container
          maxWidth='lg'
          display='flex'
          sx={{
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            px: {
              md: '15px !important',
            },
          }}
        >
        <Grid container data-aos='fade-up' width='100%' >
          <Grid item xs={12} md={6}>
            <Box width={1} height={1}>
              <Box display='flex' flexDirection='column'>
              <Button
                  variant="contained"
                  color="primary"
                  size="xlarge"
                  href="\imagesearch"
                  sx={{
                    height: '20em',
                    marginRight: '1em',
                    padding: '3em',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // Align content center horizontally
                    justifyContent: 'center',
                  }}
                >
                <Typography variant='h4' gutterBottom fontWeight={700} padding={5}>
                Semantic Image Search
                </Typography>
                <Typography variant='h6' color={theme.palette.text.secondary}>
                Discover images based on content with this feature, offering a seamless way to search through your uploaded images.
                </Typography>
              </Button>
            </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box width={1} height={1}>
              <Box display='flex' flexDirection='column'>
              <Button
                  variant="contained"
                  color="primary"
                  size="xlarge"
                  href="\classifier"
                  sx={{
                    height: '20em',
                    marginRight: '1em',
                    padding: '3em',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                  }}
                >
                <Typography variant='h4' gutterBottom fontWeight={700} padding={5}>
                Image Captioning
                </Typography>
                <Typography variant='h6' color={theme.palette.text.secondary}>
                Effortlessly enhance your images with meaningful captions using this feature.
                </Typography>
              </Button>
            </Box>
            </Box>
          </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Description;
