import React, { useState, useEffect } from 'react';
import { Box, TextField } from '@mui/material';

const GenerateCaption = ({ theme }) => {
  const [generatedText, setGeneratedText] = useState('');
  

  useEffect(() => {
    // Tutaj możesz umieścić kod do generowania tekstu przez model
    // np. wywołanie odpowiedniego API, funkcji itp.
    const textFromModel = "Tekst wygenerowany przez model";
    setGeneratedText(textFromModel);
  }, []);

  return (
    <Box flex='1' marginRight={2}  >
      <TextField
        label="Generated Image Caption"
        variant="outlined"
        fullWidth
        value={generatedText}
        readOnly
        InputProps={{
            style: { color: 'white', fontWeight: 'bold' },
          }}
      />
    </Box>
  );
};

export default GenerateCaption;