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
    <Grid item xs={8} md={3.8}>
      <Box width={1} height={1}>
        <Box display='flex' flexDirection='column' alignItems='flex-start'>
        <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              width: '75%', // Adjust the width as needed
              marginBottom: theme.spacing(2),
            }}
          >
            {icon}
          <Typography variant='h6' gutterBottom fontWeight={700}>
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
