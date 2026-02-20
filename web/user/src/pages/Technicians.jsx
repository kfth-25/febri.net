import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Box,
  Button,
  Rating,
  Tooltip,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Phone,
  Mail,
  LocationOn,
  Verified,
  Schedule,
  Search,
  FilterList,
  CalendarMonth
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Data dummy teknisi (bisa diganti dengan API nanti)
const technicians = [
  {
    id: 1,
    name: 'Budi Santoso',
    role: 'Senior Fiber Technician',
    photo: 'https://i.pravatar.cc/150?img=1',
    status: 'available', // available, busy, off_duty
    area: 'Jakarta Barat & Pusat',
    rating: 4.8,
    completed_jobs: 1240,
    skills: ['Fiber Optic', 'Router Setup', 'CCTV'],
    certifications: ['MTCNA', 'K3 Listrik'],
    phone: '+62 812-3456-7890',
    email: 'budi@febrinet.id',
    experience: 8 // tahun
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    role: 'Network Engineer',
    photo: 'https://i.pravatar.cc/150?img=2',
    status: 'busy',
    area: 'Jakarta Selatan',
    rating: 4.9,
    completed_jobs: 890,
    skills: ['MikroTik', 'Wireless', 'Troubleshooting'],
    certifications: ['MTCRE', 'MTCWE'],
    phone: '+62 813-9876-5432',
    email: 'siti@febrinet.id',
    experience: 6
  },
  {
    id: 3,
    name: 'Ahmad Wijaya',
    role: 'Field Technician',
    photo: 'https://i.pravatar.cc/150?img=3',
    status: 'available',
    area: 'Jakarta Timur',
    rating: 4.6,
    completed_jobs: 650,
    skills: ['Installation', 'Cable Management', 'Customer Service'],
    certifications: ['Customer Service'],
    phone: '+62 815-1234-5678',
    email: 'ahmad@febrinet.id',
    experience: 4
  },
  {
    id: 4,
    name: 'Dewi Lestari',
    role: 'Fiber Optic Specialist',
    photo: 'https://i.pravatar.cc/150?img=4',
    status: 'off_duty',
    area: 'Jakarta Utara',
    rating: 4.7,
    completed_jobs: 1100,
    skills: ['Fiber Splicing', 'OTDR Testing', 'Network Design'],
    certifications: ['CFOT', 'MTCNA'],
    phone: '+62 817-5555-6666',
    email: 'dewi@febrinet.id',
    experience: 10
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'available': return 'success';
    case 'busy': return 'warning';
    case 'off_duty': return 'default';
    default: return 'default';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'available': return 'Tersedia';
    case 'busy': return 'Sedang Bertugas';
    case 'off_duty': return 'Off Duty';
    default: return status;
  }
};

const getStatusDescription = (status) => {
  switch (status) {
    case 'available':
      return 'Teknisi tidak sedang sibuk dan siap dijadwalkan.';
    case 'busy':
      return 'Teknisi sedang mengerjakan pemasangan lain, jadwal akan menyesuaikan.';
    case 'off_duty':
      return 'Teknisi sedang tidak bertugas dan tidak dapat dipilih.';
    default:
      return '';
  }
};

const Technicians = () => {
  const [selectedTech, setSelectedTech] = useState(null);
  const [infoMessage, setInfoMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasInstallation, setHasInstallation] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const otherTechnicians = selectedTech
    ? technicians.filter((t) => t.id !== selectedTech.id)
    : technicians;

  useEffect(() => {
    try {
      const confirmationRaw = localStorage.getItem('last_installation_confirmation');
      if (!confirmationRaw) {
        setHasInstallation(false);
        setSelectedTech(null);
        setInfoMessage('Anda belum mengajukan pemasangan. Jika memilih teknisi sekarang, Anda akan diarahkan ke form pemasangan.');
        setErrorMessage('');
        return;
      }

      const confirmation = JSON.parse(confirmationRaw);
      if (user) {
        if (confirmation.userId && user.id && confirmation.userId !== user.id) {
          setHasInstallation(false);
          setSelectedTech(null);
          setInfoMessage('Anda belum mengajukan pemasangan untuk akun ini. Jika memilih teknisi, Anda akan diarahkan ke form pemasangan.');
          setErrorMessage('');
          return;
        }
        if (!confirmation.userId && confirmation.userEmail && user.email && confirmation.userEmail !== user.email) {
          setHasInstallation(false);
          setSelectedTech(null);
          setInfoMessage('Anda belum mengajukan pemasangan untuk akun ini. Jika memilih teknisi, Anda akan diarahkan ke form pemasangan.');
          setErrorMessage('');
          return;
        }
      }

      setHasInstallation(true);
      if (confirmation.technician && confirmation.technician.name) {
        setSelectedTech(confirmation.technician);
        setInfoMessage(`Teknisi ${confirmation.technician.name} sudah dipilih untuk pemasangan Anda. Anda dapat menggantinya dengan memilih teknisi lain.`);
      } else {
        setSelectedTech(null);
        setInfoMessage('Pilih salah satu teknisi di bawah untuk permohonan pemasangan Anda. Setelah memilih, Anda akan diarahkan ke halaman Tagihan untuk melihat tagihan pemasangan.');
      }
      setErrorMessage('');
    } catch {
      setHasInstallation(false);
      setSelectedTech(null);
      setErrorMessage('Gagal membaca data pemasangan. Silakan buka ulang halaman ini setelah mengajukan pemasangan.');
    }
  }, [user]);

  const handleSelectTechnician = (tech) => {
    if (tech.status === 'off_duty') {
      return;
    }

    const selected = {
      id: tech.id,
      name: tech.name,
      phone: tech.phone
    };
    setSelectedTech(selected);

    if (!hasInstallation) {
      try {
        localStorage.setItem('preselected_technician', JSON.stringify(selected));
      } catch {
      }
      navigate('/installation');
      return;
    }

    try {
      const raw = localStorage.getItem('installation_requests');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) {
          const updated = [...list];
          let targetIndex = updated.length - 1;
          if (user) {
            for (let i = updated.length - 1; i >= 0; i -= 1) {
              const item = updated[i];
              if (item.userId && user.id && item.userId === user.id) {
                targetIndex = i;
                break;
              }
              if (!item.userId && item.userEmail && user.email && item.userEmail === user.email) {
                targetIndex = i;
                break;
              }
            }
          }
          if (targetIndex >= 0) {
            updated[targetIndex] = {
              ...updated[targetIndex],
              technician: {
                id: tech.id,
                name: tech.name,
                phone: tech.phone
              }
            };
            localStorage.setItem('installation_requests', JSON.stringify(updated));
          }
        }
      }

      const confirmationRaw = localStorage.getItem('last_installation_confirmation');
      if (confirmationRaw) {
        const confirmation = JSON.parse(confirmationRaw);
        const updatedConfirmation = {
          ...confirmation,
          technician: {
            id: tech.id,
            name: tech.name,
            phone: tech.phone
          }
        };
        localStorage.setItem('last_installation_confirmation', JSON.stringify(updatedConfirmation));
      }

      setInfoMessage(`Teknisi ${tech.name} berhasil dipilih untuk pemasangan Anda.`);
      setErrorMessage('');
      navigate('/billing');
    } catch {
      setErrorMessage('Gagal menyimpan pilihan teknisi. Silakan coba lagi.');
    }
  };

  return (
    <Layout>
      <Box sx={{ pt: { xs: 12, md: 15 }, pb: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Tim Teknisi Kami
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={600} mx="auto">
            Profesional dan berpengalaman siap membantu instalasi dan perbaikan jaringan Anda
          </Typography>
        </Box>

        {errorMessage && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="warning">{errorMessage}</Alert>
          </Box>
        )}
        {infoMessage && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="info">{infoMessage}</Alert>
          </Box>
        )}

        {hasInstallation && selectedTech && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Teknisi yang Anda pilih
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '2px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={technicians.find((t) => t.id === selectedTech.id)?.photo}
                        alt={selectedTech.name}
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {selectedTech.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Teknisi terpilih untuk pemasangan Anda
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {selectedTech.phone}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setSelectedTech(null)}
                      sx={{ textTransform: 'none' }}
                    >
                      Ganti Teknisi
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Grid Teknisi */}
        <Grid container spacing={3}>
          {otherTechnicians.map((tech) => (
            <Grid item xs={12} sm={6} md={4} key={tech.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                {/* Header Card */}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      src={tech.photo} 
                      alt={tech.name}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {tech.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {tech.role}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip 
                    label={getStatusText(tech.status)}
                    color={getStatusColor(tech.status)}
                    size="small"
                    sx={{ mb: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {getStatusDescription(tech.status)}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={tech.rating} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {tech.rating} ({tech.completed_jobs} pekerjaan)
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {tech.area}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Schedule fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {tech.experience} tahun pengalaman
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                      Keahlian:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {tech.skills.map((skill, index) => (
                        <Chip 
                          key={index}
                          label={skill}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {tech.certifications.length > 0 && (
                    <Box>
                      <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                        Sertifikasi:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {tech.certifications.map((cert, index) => (
                          <Chip 
                            key={index}
                            label={cert}
                            size="small"
                            color="primary"
                            icon={<Verified fontSize="small" />}
                            sx={{ fontSize: '0.75rem' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <Tooltip title="Telepon">
                      <IconButton 
                        size="small" 
                        color="primary"
                        href={`tel:${tech.phone}`}
                      >
                        <Phone />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Email">
                      <IconButton 
                        size="small" 
                        color="primary"
                        href={`mailto:${tech.email}`}
                      >
                        <Mail />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => handleSelectTechnician(tech)}
                    disabled={tech.status === 'off_duty'}
                    sx={{ textTransform: 'none' }}
                  >
                    {tech.status === 'off_duty' ? 'Tidak Tersedia' : 'Pilih Teknisi'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Informasi Status Teknisi
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 12, height: 12, bgcolor: 'success.main', borderRadius: '50%', mr: 1 }} />
              <Typography variant="body2">Tersedia - Siap ditugaskan</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 12, height: 12, bgcolor: 'warning.main', borderRadius: '50%', mr: 1 }} />
              <Typography variant="body2">Sedang Bertugas - Ada pekerjaan aktif</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 12, height: 12, bgcolor: 'grey.400', borderRadius: '50%', mr: 1 }} />
              <Typography variant="body2">Off Duty - Tidak tersedia</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
      </Box>
    </Layout>
  );
};

export default Technicians;
