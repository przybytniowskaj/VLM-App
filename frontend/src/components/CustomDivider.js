import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const CustomDivider = () => {
  return (
    <Box
      maxWidth={{ sm: 720, md: 1236 }}
      width={4}
      margin='0 auto'
      paddingTop={10}
    >
      <Divider />
    </Box>
  );
};

export default CustomDivider;
