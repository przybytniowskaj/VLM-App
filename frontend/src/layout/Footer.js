import React from 'react';
import { Box, Divider, Grid, Hidden, Link, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        backgroundColor={theme.palette.background.default}
        paddingTop='1px'
        paddingBottom='1px'
        position='fixed'
        bottom='0'
        left='0'
        width='100%'
      >
        <Divider />
        <Box
          backgroundColor={theme.palette.background.default}
          position='relative'
          padding={theme.spacing(0.15)}
        >
          <Grid container spacing={0}>
            <Hidden mdDown>
              <Grid container item xs={12} md={4}>
              <List>
                <ListItemButton>
                  <ListItemText
                    primary={
                      <Typography
                        variant='body2'
                        color={theme.palette.text.secondary}
                      >
                        Photos from   
                        <Link
                          href='https://unsplash.com/photos/FWoH2qhLb5I'
                          alt='Unsplash'
                          target='_blank'
                          rel='noreferrer'
                          color={theme.palette.text.secondary}
                        >
                        {' '}  Unsplash
                        </Link>
                        .
                      </Typography>
                    }
                  />
                </ListItemButton>
              </List>
              </Grid>
            </Hidden>
            <Grid container item xs={12} md={4} justifyContent='center'>
              <List>
                <ListItemButton>
                  <ListItemText
                    primary={
                      <Typography
                        variant='body2'
                        color={theme.palette.text.secondary}
                      >
                        Copyright &copy; {new Date().getFullYear()} Maja Andrzejczuk & Julia Przybytniowska.
                      </Typography>
                    }
                  />
                </ListItemButton>
              </List>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Footer;
