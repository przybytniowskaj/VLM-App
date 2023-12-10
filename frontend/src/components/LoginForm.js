import React, { useState } from 'react';
import { Button, Box, Grid, LinearProgress, Typography, TextField, useTheme } from '@mui/material';

const LoginForm = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('http://127.0.0.1:8000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      setIsLoading(false);

      if (response.status == 200) {
        const data = await response.json();

        localStorage.setItem('Token', data.token);
        console.log(localStorage.getItem('Token'));
        console.log(data.token);
        alert('Login successful! Welcome, ' + data.username);
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        alert('Login unsuccessful! Error ' + errorData);
      }
    } catch (error) {
      setIsLoading(false);
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
          <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? <LinearProgress color="success" size={20} /> : 'Login'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default LoginForm;