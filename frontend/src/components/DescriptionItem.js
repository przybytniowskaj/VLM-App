import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import Button from '@mui/material/Button';

const DescriptionItem = ({ icon, title, subtitle }) => {
  const theme = useTheme();

  return (
    <Grid item xs={12} md={6}>
      <Box width={1} height={1}>
        <Box display='flex' flexDirection='column'>
        <Button
            variant="contained"
            color="primary"
            size="xlarge"
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
            {icon}
          <Typography variant='h6' gutterBottom fontWeight={700} padding={5}>
            {title}
          </Typography>
          <Typography color={theme.palette.text.secondary}>
            {subtitle}
          </Typography>
        </Button>
      </Box>
      </Box>
    </Grid>
  );
};

export default DescriptionItem;
