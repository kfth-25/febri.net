import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f172a',
      light: '#334155',
      dark: '#020617',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f1f5f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    success: { main: '#10b981', light: '#d1fae5', contrastText: '#fff' },
    info:    { main: '#0ea5e9', light: '#e0f2fe', contrastText: '#fff' },
    warning: { main: '#f59e0b', light: '#fef3c7', contrastText: '#fff' },
    error:   { main: '#ef4444', light: '#fee2e2', contrastText: '#fff' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, color: '#0f172a' },
    h2: { fontWeight: 700, color: '#0f172a' },
    h3: { fontWeight: 700, color: '#0f172a' },
    h4: { fontWeight: 700, color: '#0f172a' },
    h5: { fontWeight: 700, color: '#0f172a' },
    h6: { fontWeight: 700, color: '#0f172a' },
    subtitle1: { color: '#475569', fontWeight: 500 },
    subtitle2: { color: '#475569', fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0.3 },
    caption: { color: '#94a3b8', fontWeight: 500 },
  },
  shape: { borderRadius: 10 },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(15,23,42,0.05)',
    '0 1px 3px 0 rgba(15,23,42,0.08), 0 1px 2px -1px rgba(15,23,42,0.08)',
    '0 4px 6px -1px rgba(15,23,42,0.07), 0 2px 4px -2px rgba(15,23,42,0.07)',
    '0 10px 15px -3px rgba(15,23,42,0.07), 0 4px 6px -4px rgba(15,23,42,0.07)',
    '0 20px 25px -5px rgba(15,23,42,0.07), 0 8px 10px -6px rgba(15,23,42,0.07)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
    '0 25px 50px -12px rgba(15,23,42,0.25)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': { boxShadow: 'none', transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)' },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(15,23,42,0.08), 0 1px 2px -1px rgba(15,23,42,0.08)',
          border: '1px solid #e2e8f0',
        },
        rounded: { borderRadius: 12 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(15,23,42,0.08), 0 1px 2px -1px rgba(15,23,42,0.08)',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(15,23,42,0.07), 0 4px 6px -4px rgba(15,23,42,0.07)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          color: '#f8fafc',
          borderRight: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 0',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            background: 'linear-gradient(90deg, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0.1) 100%)',
            borderLeft: '3px solid #3b82f6',
            '& .MuiListItemIcon-root': { color: '#60a5fa' },
            '& .MuiListItemText-primary': { color: '#f8fafc', fontWeight: 700 },
            '&:hover': { background: 'linear-gradient(90deg, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.15) 100%)' },
          },
          '&:hover': { background: 'rgba(255,255,255,0.07)' },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: { color: '#94a3b8', minWidth: 40, transition: 'color 0.2s' },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: { fontWeight: 500, fontSize: 14, color: '#cbd5e1' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #e2e8f0',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255,255,255,0.95)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: '#f8fafc',
            fontWeight: 700,
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: '#475569',
            borderBottom: '2px solid #e2e8f0',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: '#f8fafc' },
          '&:last-child td': { borderBottom: 0 },
          transition: 'background-color 0.15s ease',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #f1f5f9',
          fontSize: 14,
          padding: '14px 16px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: 12,
          borderRadius: 6,
        },
        colorSuccess: {
          backgroundColor: '#d1fae5',
          color: '#059669',
          border: 'none',
        },
        colorWarning: {
          backgroundColor: '#fef3c7',
          color: '#d97706',
          border: 'none',
        },
        colorError: {
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          border: 'none',
        },
        colorInfo: {
          backgroundColor: '#e0f2fe',
          color: '#0284c7',
          border: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6', borderWidth: 2 },
          },
        },
      },
    },
    Muidialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTab-root': {
            fontWeight: 600,
            textTransform: 'none',
            fontSize: 14,
            minHeight: 48,
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: 3,
            backgroundColor: '#3b82f6',
          },
        },
      },
    },
  },
});

export default theme;
