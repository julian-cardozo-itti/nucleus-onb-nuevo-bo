import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { deepPurple, grey, blue, green, purple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[700],
      light: deepPurple[500],
      dark: deepPurple[900],
    },
    secondary: {
      main: blue[500],
      light: blue[300],
      dark: blue[700],
    },
    success: {
      main: green[600],
      light: green[400],
      dark: green[800],
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    background: {
      default: grey[50],
      paper: grey[100],
    },
    text: {
      primary: grey[900],
      secondary: grey[700],
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 700 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1.1rem', fontWeight: 500 },
    subtitle1: { fontSize: '1rem', fontWeight: 400 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    button: { textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${grey[200]}`,
        },
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
