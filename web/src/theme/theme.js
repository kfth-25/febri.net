import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f172a', // Slate 900 - Dark Professional
      light: '#334155', // Slate 700
      dark: '#020617', // Slate 950
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3b82f6', // Blue 500 - Professional Accent
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f1f5f9', // Slate 100 - Very Light Gray Blue
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // Slate 800
      secondary: '#64748b', // Slate 500
    },
    success: {
        main: '#10b981',
        contrastText: '#fff'
    },
    info: {
        main: '#0ea5e9',
        contrastText: '#fff'
    },
    warning: {
        main: '#f59e0b',
        contrastText: '#fff'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, color: '#0f172a' },
    h2: { fontWeight: 700, color: '#0f172a' },
    h3: { fontWeight: 600, color: '#0f172a' },
    h4: { fontWeight: 600, color: '#0f172a' },
    h5: { fontWeight: 600, color: '#0f172a' },
    h6: { fontWeight: 600, color: '#0f172a' },
    subtitle1: { color: '#475569' },
    subtitle2: { color: '#475569', fontWeight: 500 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8, // Sharper, more professional corners (was 12)
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 20px',
          boxShadow: 'none',
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)',
            backgroundColor: '#1e293b',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // Subtle shadow
          border: '1px solid #e2e8f0', // Subtle border
        },
        rounded: {
            borderRadius: 8,
        }
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0',
            }
        }
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                backgroundColor: '#0f172a', // Dark Sidebar by default
                color: '#f8fafc',
                borderRight: 'none',
            }
        }
    },
    MuiListItemButton: {
        styleOverrides: {
            root: {
                '&.Mui-selected': {
                    backgroundColor: 'rgba(59, 130, 246, 0.15)', // Blue tint
                    borderLeft: '4px solid #3b82f6',
                    '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.25)',
                    }
                },
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }
            }
        }
    },
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                color: '#94a3b8', // Slate 400
                minWidth: 40,
            }
        }
    },
    MuiListItemText: {
        styleOverrides: {
            primary: {
                fontWeight: 500,
            }
        }
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                borderBottom: '1px solid #e2e8f0',
            }
        }
    }
  },
});

export default theme;
