import { createTheme } from '@mui/material/styles';
import { GRADIENTS, UI_COLORS } from './colors';

// Premium Modern Theme Configuration - Aligned with reference design
export const theme = createTheme({
  palette: {
    primary: {
      main: '#8b5cf6', // Purple 500 - matches reference
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3b82f6', // Blue 500
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    background: {
      default: UI_COLORS.bgDefault,
      paper: UI_COLORS.bgPaper,
    },
    text: {
      primary: UI_COLORS.textPrimary,
      secondary: UI_COLORS.textSecondary,
    },
    divider: '#e2e8f0',
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
          borderRadius: 10,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
          },
        },
        containedPrimary: {
          background: GRADIENTS.primary,
          '&:hover': {
            background: GRADIENTS.purple,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Larger radius to match reference
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
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
          background: GRADIENTS.header,
          backdropFilter: 'none',
          borderBottom: 'none',
          boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1)',
          color: '#ffffff',
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
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.95rem',
          minHeight: 48,
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
  },
});
