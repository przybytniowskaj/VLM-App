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
    <Box width="500px" alignItems={'center'} bgcolor="white" padding={2} >
      <TextField
        variant="outlined"
        fullWidth
        value={generatedText}
        readOnly
        InputProps={{
          style: { color: 'black', fontWeight: 'bold' },
        }}
      />
    </Box>
  );
};

export default GenerateCaption;