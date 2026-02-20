import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  InputAdornment, 
  IconButton, 
  Link, 
  Container,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Wifi } from '@mui/icons-material';
import { login } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    // Clear error when user types
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(credentials.email, credentials.password);
      console.log('Login success:', data);
      
      // Redirect to Dashboard
      navigate('/dashboard'); 
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        padding: 2,
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Card 
          elevation={4} 
          className="login-card"
          sx={{ 
            borderRadius: 4, 
            overflow: 'visible',
            position: 'relative',
            mt: 4,
            mb: 4
          }}
        >
          {/* Logo / Icon Header */}
          <Box
            sx={{
              position: 'absolute',
              top: -40,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              zIndex: 2,
            }}
          >
            <Wifi sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          </Box>

          <CardContent sx={{ pt: 6, pb: 4, px: 4 }}>
            <Typography variant="h5" component="h1" align="center" fontWeight="700" gutterBottom sx={{ mt: 2 }}>
              WiFi Service
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
              Masuk untuk mengelola layanan internet
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                variant="outlined"
                margin="normal"
                value={credentials.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                value={credentials.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Link href="#" variant="body2" underline="hover" sx={{ fontWeight: 500 }}>
                  Lupa Password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                className="login-button"
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'MASUK'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.8)', mt: 3 }}>
          &copy; {new Date().getFullYear()} WiFi Service Management System
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
