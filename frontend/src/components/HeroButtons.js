import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme, useMediaQuery } from '@mui/material';
import InfoIcon from '@mui/icons-material/HelpOutline';
import PlayIcon from '@mui/icons-material/PlayCircleOutlineOutlined';


const HeroButtons = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <Box width = '100%' >
      <Box 
      
        display='flex'
        //flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretched', sm: 'flex-start' }}
        justifyContent='center'
        //marginTop={{ xs: 2, sm: 0 }}
        //marginRight={{ sm: 1 }}
        //width={{ xs: '100%', md: '20%' }}
      >
       {/* <Button
          component='a'
          variant='outlined'
          color='primary'
          size='large'
          href='#'
          fullWidth={isMd ? false : true}
          disableElevation={true}
          sx={{
            padding: '18px 34px',
            marginRight: '15px',
            fontSize: '18px',
            border: `2px solid ${theme.palette.primary.main}`,
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              border: `2px solid ${theme.palette.primary.main}`,
            },
          }}
        >
          Semantic Image Search
        </Button>
        <Box
          
          alignItems={{ xs: 'stretched', sm: 'flex-start' }}
          justifyContent='center'
        >
          <Button
            component='a'
            variant='outlined'
            color='primary'
            size='large'
            href='#'
            fullWidth={isMd ? false : true}
            disableElevation={true}
            sx={{
              padding: '18px 34px',
              marginRight: '15px',
              fontSize: '18px',
              border: `2px solid ${theme.palette.primary.main}`,
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                border: `2px solid ${theme.palette.primary.main}`,
              },
            }}
          >
            Image Captioning
          </Button>
          </Box> */}  
      </Box>
      
    </Box>
  );
};

export default HeroButtons;
