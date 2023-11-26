import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { Box, TextField, Button, Grid, LinearProgress, Typography, useTheme } from '@mui/material';

import Header from '../layout/Header';

const Login = () => {
  const theme = useTheme();
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);

  const toggleForm = () => {
    setIsLoginFormVisible(!isLoginFormVisible);
  };

  return (
    <>
      <Header title="Login / Register" />
      <Box 
        backgroundColor={theme.palette.background.default}
        paddingTop={15}
        flexDirection="column"
        display="flex"
        justifyContent="center"
        alignItems="center">
        {isLoginFormVisible ? <LoginForm /> : <RegisterForm />}
        <Grid container justifyContent="center">
          <Button variant="outlined" onClick={toggleForm} style={{
                marginTop: 10, 
                color: theme.palette.primary.contrastText, 
                borderColor: theme.palette.primary.main, 
            }}  >
            {isLoginFormVisible ? 'Switch to Register' : 'Switch to Login'}

          </Button>
        </Grid>
      </Box>
    </>
  );
};

export default Login;