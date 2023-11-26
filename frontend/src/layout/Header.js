import React from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';

const Header = ({ onSidebarOpen, title, color_back}) => {
  const theme = useTheme();

  return (
    <>
      <AppBar id='appbar_header'
        elevation={5}
        sx={{
          backgroundColor: 'black',
          color: theme.palette.common.white,
        }}
      >
        <Toolbar sx={{ minHeight: 60 }}>
        <Button
            component='a'
            color='primary'
            href='/'
            size='small'
            variant='text'
            sx={{
              color: theme.palette.common.white,
              fontSize: theme.typography.subtitle1,
              fontWeight: 'medium',
              mr: 2,
              '& svg': {
                mr: 0.5,
              },
            }}
          >
            <HomeOutlinedIcon /> Home
          </Button>
          <Button
            component='a'
            color='primary'
            href='/login'
            size='small'
            variant='text'
            sx={{
              color: theme.palette.common.white,
              fontSize: theme.typography.subtitle1,
              fontWeight: 'medium',
              mr: 2,
              '& svg': {
                mr: 0.5,
              },
            }}
          >
            <LockOutlinedIcon /> Login
          </Button>
          {/* <Button
            component='a'
            color='primary'
            href='/signup'
            size='small'
            variant='text'
            sx={{
              color: theme.palette.common.white,
              fontSize: theme.typography.subtitle1,
              fontWeight: 'medium',
              mr: 2,
              '& svg': {
                mr: 0.5,
              },
            }}
          >
            <LockOutlinedIcon /> Sign Up
          </Button> */}
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant='h4'>
            {title}
          </Typography>
         {/* <Button
            component='a'
            color='primary'
            href='/classifier'
            size='small'
            variant='text'
            sx={{
              color: theme.palette.common.white,
              fontSize: theme.typography.subtitle1,
              fontWeight: 'medium',
              mr: 2,
              '& svg': {
                mr: 0.5,
              },
            }}
          >
            <InsertPhotoOutlinedIcon style={{ height: 23, width: 23 }} /> Image
            Classifier
          </Button> */}
        </Toolbar>
        <Divider />        
      </AppBar>
    </>
  );
};

export default Header;
