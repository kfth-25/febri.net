import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility, VisibilityOff, Email, Lock,
  SignalWifi4Bar as SignalIcon,
  WifiTethering as WifiRingIcon,
  CheckCircleOutline as CheckIcon
} from '@mui/icons-material';
import { login } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  'Manajemen pelanggan & layanan WiFi',
  'Monitoring gangguan + penugasan teknisi',
  'Laporan & analitik real-time',
  'Kirim notifikasi ke mobile app',
];

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(credentials.email, credentials.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left — Brand Panel */}
      {!isMobile && (
        <Box sx={{
          width: '48%',
          background: 'linear-gradient(145deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          px: 7,
          py: 6,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          {[200, 320, 440].map((size, i) => (
            <Box key={i} sx={{
              position: 'absolute',
              top: '50%',
              right: -size / 2.5,
              transform: 'translateY(-50%)',
              width: size,
              height: size,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.06)',
            }} />
          ))}

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SignalIcon sx={{ color: '#fff', fontSize: 26 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#fff', letterSpacing: 0.5 }}>
              WiFi Net
            </Typography>
          </Box>

          <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', mb: 1.5, lineHeight: 1.2, maxWidth: 420 }}>
            Kelola Layanan<br />
            <Box component="span" sx={{ color: '#60a5fa' }}>Internet</Box> Anda
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.65)', mb: 5, maxWidth: 360, lineHeight: 1.7 }}>
            Platform admin terpadu untuk ISP. Monitor, kelola, dan optimalkan layanan dari satu tempat.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {FEATURES.map((f) => (
              <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckIcon sx={{ color: '#34d399', fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
                  {f}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Bottom tag */}
          <Box sx={{ position: 'absolute', bottom: 32, left: 56 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>
              &copy; {new Date().getFullYear()} WiFi Net — All rights reserved
            </Typography>
          </Box>
        </Box>
      )}

      {/* Right — Form Panel */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f8fafc',
        px: { xs: 3, sm: 6, md: 8 },
        py: 6,
      }}>
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile Logo */}
          {isMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Box sx={{
                width: 56, height: 56, borderRadius: 3,
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(59,130,246,0.35)',
              }}>
                <SignalIcon sx={{ color: '#fff', fontSize: 28 }} />
              </Box>
            </Box>
          )}

          <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', mb: 0.5 }}>
            Selamat Datang 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
            Masuk ke admin panel WiFi Net
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75, color: '#374151' }}>
                Email
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                placeholder="admin@wifi.net"
                variant="outlined"
                value={credentials.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#94a3b8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ bgcolor: '#fff' }}
              />
            </Box>

            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75, color: '#374151' }}>
                Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                variant="outlined"
                value={credentials.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#94a3b8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ bgcolor: '#fff' }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.6,
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 15,
                mt: 0.5,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                boxShadow: '0 4px 14px rgba(15,23,42,0.25)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
                  boxShadow: '0 6px 20px rgba(15,23,42,0.3)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Masuk ke Dashboard'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
