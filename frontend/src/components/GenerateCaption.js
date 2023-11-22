import React, { useState, useEffect } from 'react';
import { Box, TextField } from '@mui/material';

const GenerateCaption = ({ classificationResult
 }) => {
  const [generatedText, setGeneratedText] = useState('');
  

  useEffect(() => {
    // Tutaj możesz umieścić kod do generowania tekstu przez model
    // np. wywołanie odpowiedniego API, funkcji itp.
    const textFromModel = classificationResult;
    setGeneratedText(textFromModel);
  }, []);

  return (
    <Box width="500px" alignItems={'center'} padding={2} >
      <TextField
        variant="outlined"
        fullWidth
        value={generatedText}
        readOnly
        disabled
        InputProps={{
          style: { color: 'white', fontWeight: 'bold' },
        }}
      />
    </Box>
  );
};

export default GenerateCaption;