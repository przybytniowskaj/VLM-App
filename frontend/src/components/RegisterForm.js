import React, { useState } from 'react';
import { Button, Box, Grid, Typography, TextField, useTheme } from '@mui/material';
import axios from 'axios';

const RegisterForm = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/signup/', {
        email: email,
        username: username,
        password: password,
      });

      if (response.status === 201) {
        console.log('Registration successful');
        window.location.href = '/login';
         
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('An error occurred during registration:', error);
      if (error.response && error.response.status === 400) {
         if (error.response.data.password) {
          setError('Password should be at least 8 characters long.');
        } else {
          setError('An error occurred during registration. Please ensure that your email is not already in use on our site and try again.');
        }
      } else {
        setError('An error occurred during registration. Please ensure that your email is not already in use on our site and try again.');
      }
    }
  };

  return (
    <Box >
      {error && (
        <Typography variant="body1" style={{ color: 'red', textAlign: 'center', paddingBottom: '2em', }}>
          {error}
        </Typography>
      )}
      <Typography variant="h4" style={{
                color: 'white',
                textAlign: 'center',
                display: 'block',
                paddingBottom: '2em',
                }}>  After a successful registration, the page will transfer you to the login page. </Typography>
      <Typography variant="h6" style={{
                color: 'white',
                textAlign: 'center',
                display: 'block',
                paddingBottom: '1em',
                }}>Register Form</Typography>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              style = {{color: theme.palette.primary.contrastText}}
              InputProps={{
                style: { color: 'white' }, 
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={handleUsernameChange}
              style = {{color: theme.palette.primary.contrastText}}
              InputProps={{
                style: { color: 'white' }, 
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={handlePasswordChange}
              style = {{color: theme.palette.primary.contrastText}}
              InputProps={{
                style: { color: 'white' }, 
              }}
            />
          </Grid>
          <Grid item xs={12} display="flex"
        justifyContent="center"
        alignItems="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegister}
              
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default RegisterForm;