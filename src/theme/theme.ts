import { createTheme } from '@mui/material/styles';

// Premium Modern Theme Configuration
export const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // Indigo 500
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#14b8a6', // Teal 500
      light: '#2dd4bf',
      dark: '#0d9488',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Slate 50
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // Slate 800
      secondary: '#64748b', // Slate 500
    },
    divider: '#e2e8f0', // Slate 200
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Outfit", "Inter", sans-serif',
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#0f172a',
    },
    h2: {
      fontFamily: '"Outfit", "Inter", sans-serif',
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: '#0f172a',
    },
    h3: {
      fontFamily: '"Outfit", "Inter", sans-serif',
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#1e293b',
    },
    h4: {
      fontFamily: '"Outfit", "Inter", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1e293b',
    },
    h5: {
      fontFamily: '"Outfit", "Inter", sans-serif',
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#1e293b',
    },
    h6: {
      fontFamily: '"Outfit", "Inter", sans-serif',
      fontSize: '1rem',
      fontWeight: 600,
      color: '#334155',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)', // Soft primary glow
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', // Tailwind 'shadow-md' feel
          border: '1px solid rgba(226, 232, 240, 0.8)', // Slate 200
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)', // Lift effect
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
          boxShadow: 'none',
          color: '#1e293b',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
  },
});