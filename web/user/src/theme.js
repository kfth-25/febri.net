import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0a1929', // Deep Navy Blue (Professional & Trust)
      light: '#1e3a5f',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00e5ff', // Vibrant Cyan/Teal (Modern & Tech)
      light: '#6effff',
      dark: '#00b2cc',
      contrastText: '#0a1929',
    },
    background: {
      default: '#f8fafc', // Very light blue-grey
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // Slate 800
      secondary: '#64748b', // Slate 500
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // Modern feel
      fontWeight: 600,
      borderRadius: 8,
    },
  },
  shape: {
    borderRadius: 12, // Softer corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
            background: 'linear-gradient(45deg, #0a1929 30%, #1e3a5f 90%)',
        },
        containedSecondary: {
            background: 'linear-gradient(45deg, #00b2cc 30%, #00e5ff 90%)',
            color: '#0a1929'
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        },
        elevation2: {
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        }
      },
    },
  },
});

export default theme;
