import React, { useState } from 'react';
import { Button, Box, Grid, LinearProgress, Typography, TextField, useTheme } from '@mui/material';

const LoginForm = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Do something with the successful login response
        
      } else {
        const errorData = await response.json();
        console.error(errorData); // Handle the login error
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Login Form</Typography>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
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
            />
          </Grid>
          <Grid item xs={12} display="flex"
            justifyContent="center"
            alignItems="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default LoginForm;