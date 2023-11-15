import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'rgb(0,0,0)',
      paper: 'rgb(20, 20, 20)',
      trans: 'rgba(x,y,z,0)',
    },
    primary: {
      main: 'rgb(20,20,20)',
    },
    text: {
      primary: 'rgb(60, 60, 60)',
      secondary: 'rgb(123, 132, 140)',
    },
    divider: 'rgb(197, 197, 197)',
  },
  typography: {
    button: {
      fontWeight: 600,
    },
    fontFamily: '"Roboto", sans-serif',
    fontSize: 13,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.25,
    },
    h5: {
      fontSize: '1.0625rem',
      fontWeight: 500,
      lineHeight: 1.25,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.25,
      textTransform: 'none'
    },
    overline: {
      fontWeight: 600,
    },
  },
});

export default theme;
