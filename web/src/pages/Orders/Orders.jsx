import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Paper, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert, CircularProgress,
  Container, Chip, MenuItem, Grid, Avatar, InputAdornment, Tooltip,
  Stepper, Step, StepLabel, StepContent, Divider
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Search as SearchIcon, Assignment as AssignmentIcon, Close as CloseIcon,
  BuildCircle as BuildCircleIcon, CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon, Timeline as TimelineIcon
} from '@mui/icons-material';
import { getSubscriptions, createSubscription, updateSubscription, deleteSubscription } from '../../services/subscriptionService';
import { getPackages } from '../../services/packageService';
import { getUsers } from '../../services/userService';
import Layout from '../../components/Layout';

const STATUS_FILTERS = [
  { key: 'Semua',      label: 'Semua',                    type: 'all' },
  { key: 'pending',    label: 'Menunggu',                  type: 'status' },
  { key: 'active',     label: 'Aktif',                    type: 'status' },
  { key: 'suspended',  label: 'Ditangguhkan',             type: 'status' },
  { key: 'terminated', label: 'Berhenti',                 type: 'status' },
  { key: 'scheduled',  label: 'Dijadwalkan',              type: 'step', color: '#3b82f6' },
  { key: 'installing', label: 'Teknisi Dalam Pemasangan', type: 'step', color: '#8b5cf6' },
  { key: 'done',       label: 'Pemasangan Selesai',       type: 'step', color: '#10b981' },
];
const STATUS_LABEL = { pending: 'Menunggu', active: 'Aktif', suspended: 'Ditangguhkan', terminated: 'Berhenti' };
const STATUS_COLOR = { active: 'success', pending: 'warning', suspended: 'error', terminated: 'default' };

const INSTALL_STEPS = [
  { key: 'pending',    label: 'Permohonan Diterima',     desc: 'Permohonan pemasangan diterima dan tercatat di sistem.' },
  { key: 'scheduled',  label: 'Dijadwalkan',              desc: 'Tim sedang menyusun jadwal kunjungan teknisi.' },
  { key: 'installing', label: 'Teknisi Dalam Pemasangan', desc: 'Teknisi sedang dalam proses pemasangan perangkat.' },
  { key: 'done',       label: 'Pemasangan Selesai',       desc: 'Pemasangan selesai dan layanan internet aktif.' },
];
const STEP_COLOR = { pending: '#f59e0b', scheduled: '#3b82f6', installing: '#8b5cf6', done: '#10b981' };
const STEP_INDEX = { pending: 0, scheduled: 1, installing: 2, done: 3 };

const Orders = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openStepDialog, setOpenStepDialog] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [stepSubscription, setStepSubscription] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [formData, setFormData] = useState({ user_id: '', wifi_package_id: '', installation_address: '', notes: '', status: 'pending' });
  const [stepForm, setStepForm] = useState({ installation_step: 'pending', scheduled_at: '', technician_notes: '' });
  const [stepLoading, setStepLoading] = useState(false);
  const [stepError, setStepError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.role === 'admin' || !currentUser.role;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subsData, pkgData, userData] = await Promise.all([
        getSubscriptions(), getPackages(), isAdmin ? getUsers('customer') : Promise.resolve([])
      ]);
      setSubscriptions(subsData); setPackages(pkgData); setUsers(userData);
      setError(null);
    } catch (err) { setError('Gagal memuat data pesanan.'); }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => {
    let list = subscriptions;
    const f = STATUS_FILTERS.find(x => x.key === activeFilter);
    if (f && f.type === 'status') list = list.filter(s => s.status === activeFilter);
    if (f && f.type === 'step')   list = list.filter(s => (s.installation_step || 'pending') === activeFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.user?.name?.toLowerCase().includes(q) ||
        s.wifi_package?.name?.toLowerCase().includes(q) ||
        s.installation_address?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [subscriptions, activeFilter, search]);

  const handleOpenDialog = (sub = null) => {
    if (sub) {
      setEditingSubscription(sub);
      setFormData({ user_id: sub.user_id, wifi_package_id: sub.wifi_package_id, installation_address: sub.installation_address, notes: sub.notes || '', status: sub.status });
    } else {
      setEditingSubscription(null);
      setFormData({ user_id: '', wifi_package_id: '', installation_address: '', notes: '', status: 'pending' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => { setOpenDialog(false); setEditingSubscription(null); };

  const handleSubmit = async () => {
    try {
      if (editingSubscription) { await updateSubscription(editingSubscription.id, formData); }
      else { await createSubscription(formData); }
      fetchData(); handleCloseDialog();
    } catch (err) { setError('Gagal menyimpan pesanan.'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus pesanan ini?')) {
      try { await deleteSubscription(id); fetchData(); }
      catch (err) { setError('Gagal menghapus pesanan.'); }
    }
  };

  // === Installation Step Dialog ===
  const handleOpenStepDialog = (sub) => {
    setStepSubscription(sub);
    setStepForm({
      installation_step: sub.installation_step || 'pending',
      scheduled_at: sub.scheduled_at ? sub.scheduled_at.slice(0, 16) : '',
      technician_notes: sub.technician_notes || '',
    });
    setStepError(null);
    setOpenStepDialog(true);
  };

  const handleCloseStepDialog = () => { setOpenStepDialog(false); setStepSubscription(null); };

  const handleSaveStep = async () => {
    setStepLoading(true);
    setStepError(null);
    try {
      await updateSubscription(stepSubscription.id, {
        installation_step: stepForm.installation_step,
        scheduled_at: stepForm.scheduled_at || null,
        technician_notes: stepForm.technician_notes || null,
      });
      fetchData();
      handleCloseStepDialog();
    } catch (err) {
      setStepError('Gagal memperbarui progres pemasangan.');
    } finally {
      setStepLoading(false);
    }
  };

  const avatarColor = (name) => {
    const colors = ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#0ea5e9'];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  const activeStepIndex = STEP_INDEX[stepForm.installation_step] ?? 0;

  return (
    <Layout title="Pemasangan">
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Daftar Pemasangan WiFi</Typography>
            <Typography variant="body2" color="text.secondary">{subscriptions.length} total pemasangan</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ borderRadius: 2, px: 2.5 }}>
            Pemasangan Manual
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        {/* Toolbar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', width: '100%' }}>
          <TextField
            placeholder="Cari pelanggan, paket, atau alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
              endAdornment: search ? (<InputAdornment position="end"><IconButton size="small" onClick={() => setSearch('')}><CloseIcon sx={{ fontSize: 16 }} /></IconButton></InputAdornment>) : null,
            }}
            sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { borderRadius: 2 }, minWidth: 300, maxWidth: 340, flexShrink: 0 }}
          />
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            overflowX: 'auto', 
            pb: 0.5, 
            flexGrow: 1,
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: 3 }
          }}>
            {STATUS_FILTERS.map((f) => (
              <Chip
                key={f.key}
                label={f.label}
                onClick={() => setActiveFilter(f.key)}
                variant={activeFilter === f.key ? 'filled' : 'outlined'}
                color={activeFilter === f.key ? 'primary' : 'default'}
                sx={{ fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}
              />
            ))}
          </Box>
        </Box>

        <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Pelanggan</TableCell>
                  <TableCell>Paket</TableCell>
                  <TableCell>Alamat Pemasangan</TableCell>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progres Pasang</TableCell>
                  <TableCell align="right">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}><CircularProgress size={30} /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <AssignmentIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1, display: 'block', mx: 'auto' }} />
                      <Typography color="text.secondary">Tidak ada pemasangan ditemukan.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((sub) => {
                    const stepKey = sub.installation_step || 'pending';
                    const stepInfo = INSTALL_STEPS.find(s => s.key === stepKey) || INSTALL_STEPS[0];
                    const stepIdx = STEP_INDEX[stepKey] ?? 0;
                    return (
                      <TableRow key={sub.id}>
                        <TableCell sx={{ fontWeight: 600 }}>#{sub.id}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 34, height: 34, fontSize: 13, fontWeight: 700, bgcolor: avatarColor(sub.user?.name) }}>
                              {sub.user?.name?.[0]?.toUpperCase() || '#'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{sub.user?.name || 'Unknown'}</Typography>
                              <Typography variant="caption" color="text.secondary">{sub.user?.email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{sub.wifi_package?.name || 'Unknown'}</Typography>
                          <Typography variant="caption" color="text.secondary">{sub.wifi_package?.speed} Mbps</Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" color="text.secondary" noWrap>{sub.installation_address}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{new Date(sub.created_at || Date.now()).toLocaleDateString('id-ID')}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={STATUS_LABEL[sub.status] || sub.status} size="small" color={STATUS_COLOR[sub.status] || 'default'} sx={{ fontWeight: 600 }} />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Mini progress dots */}
                            <Box sx={{ display: 'flex', gap: 0.4, alignItems: 'center' }}>
                              {INSTALL_STEPS.map((s, i) => (
                                <Box
                                  key={s.key}
                                  sx={{
                                    width: i <= stepIdx ? 10 : 8,
                                    height: i <= stepIdx ? 10 : 8,
                                    borderRadius: '50%',
                                    bgcolor: i <= stepIdx ? STEP_COLOR[stepKey] : '#e2e8f0',
                                    transition: 'all 0.2s',
                                  }}
                                />
                              ))}
                            </Box>
                            <Chip
                              label={stepInfo.label}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                fontSize: 11,
                                bgcolor: STEP_COLOR[stepKey] + '18',
                                color: STEP_COLOR[stepKey],
                                border: `1px solid ${STEP_COLOR[stepKey]}40`,
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Atur Progres Pemasangan">
                            <IconButton size="small" onClick={() => handleOpenStepDialog(sub)} sx={{ mr: 0.5, bgcolor: '#f0fdf4', '&:hover': { bgcolor: '#dcfce7' } }}>
                              <TimelineIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleOpenDialog(sub)} sx={{ mr: 0.5, bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}><EditIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                          <Tooltip title="Hapus"><IconButton size="small" color="error" onClick={() => handleDelete(sub.id)} sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* ===== Edit Order Dialog ===== */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
            <Typography variant="h6" fontWeight={700}>{editingSubscription ? 'Edit Pemasangan' : 'Pemasangan Manual'}</Typography>
          </DialogTitle>
          <DialogContent sx={{ px: 3, pb: 1 }}>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <TextField select required fullWidth label="Pilih Pelanggan" value={formData.user_id}
                  onChange={(e) => setFormData({...formData, user_id: e.target.value})} disabled={!isAdmin}>
                  {users.map((u) => (<MenuItem key={u.id} value={u.id}>{u.name} ({u.email})</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select required fullWidth label="Pilih Paket WiFi" value={formData.wifi_package_id}
                  onChange={(e) => setFormData({...formData, wifi_package_id: e.target.value})}>
                  {packages.map((p) => (<MenuItem key={p.id} value={p.id}>{p.name} - {p.speed} Mbps</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label="Alamat Pemasangan" multiline rows={2} value={formData.installation_address}
                  onChange={(e) => setFormData({...formData, installation_address: e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Catatan Tambahan" multiline rows={2} value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})} />
              </Grid>
              {editingSubscription && (
                <Grid item xs={12}>
                  <TextField select required fullWidth label="Status" value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <MenuItem value="pending">Menunggu</MenuItem>
                    <MenuItem value="active">Aktif</MenuItem>
                    <MenuItem value="suspended">Ditangguhkan</MenuItem>
                    <MenuItem value="terminated">Berhenti</MenuItem>
                  </TextField>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
            <Button onClick={handleCloseDialog} variant="outlined" color="inherit" sx={{ borderRadius: 2, borderColor: '#e2e8f0', color: '#64748b' }}>Batal</Button>
            <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2, px: 3 }}>Simpan</Button>
          </DialogActions>
        </Dialog>

        {/* ===== Installation Step Dialog ===== */}
        <Dialog open={openStepDialog} onClose={handleCloseStepDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ pb: 1, pt: 3, px: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <BuildCircleIcon sx={{ color: '#16a34a' }} />
            <Box>
              <Typography variant="h6" fontWeight={700}>Progres Pemasangan</Typography>
              {stepSubscription && (
                <Typography variant="caption" color="text.secondary">
                  {stepSubscription.user?.name} • #{stepSubscription.id}
                </Typography>
              )}
            </Box>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ px: 3, pb: 1, pt: 2 }}>
            {stepError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{stepError}</Alert>}

            {/* Visual Stepper */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Pilih tahap aktif pemasangan yang sedang berjalan:
            </Typography>
            <Stepper activeStep={activeStepIndex} orientation="vertical" nonLinear sx={{ mb: 3 }}>
              {INSTALL_STEPS.map((step, index) => {
                const isActive = index === activeStepIndex;
                const isCompleted = index < activeStepIndex;
                const color = STEP_COLOR[step.key];
                return (
                  <Step key={step.key} completed={isCompleted}>
                    <StepLabel
                      onClick={() => setStepForm(f => ({ ...f, installation_step: step.key }))}
                      sx={{
                        cursor: 'pointer',
                        '& .MuiStepLabel-label': {
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? color : 'text.primary',
                        },
                        '& .MuiStepIcon-root': {
                          color: isCompleted ? '#10b981' : isActive ? color : '#e2e8f0',
                          cursor: 'pointer',
                        },
                        '& .MuiStepIcon-text': { fill: isCompleted || isActive ? '#fff' : '#94a3b8' },
                      }}
                      StepIconComponent={isCompleted ? CheckCircleIcon : isActive ? () => (
                        <Box sx={{
                          width: 24, height: 24, borderRadius: '50%', bgcolor: color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: 14, fontWeight: 700,
                        }}>{index + 1}</Box>
                      ) : () => (
                        <Box sx={{
                          width: 24, height: 24, borderRadius: '50%', border: `2px solid #e2e8f0`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#94a3b8', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                          '&:hover': { borderColor: color, color: color },
                        }}>{index + 1}</Box>
                      )}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {step.label}
                        {isActive && (
                          <Chip label="Aktif" size="small" sx={{ bgcolor: color + '18', color, fontSize: 10, fontWeight: 700, height: 18 }} />
                        )}
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
                    </StepContent>
                  </Step>
                );
              })}
            </Stepper>

            <Divider sx={{ mb: 2 }} />

            {/* Additional fields */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Jadwal Kunjungan Teknisi"
                  type="datetime-local"
                  value={stepForm.scheduled_at}
                  onChange={(e) => setStepForm(f => ({ ...f, scheduled_at: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  helperText="Opsional — isi jika sudah ada jadwal teknisi"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Catatan Teknisi"
                  multiline
                  rows={2}
                  value={stepForm.technician_notes}
                  onChange={(e) => setStepForm(f => ({ ...f, technician_notes: e.target.value }))}
                  helperText="Opsional — catatan internal teknisi"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
            <Button onClick={handleCloseStepDialog} variant="outlined" color="inherit" sx={{ borderRadius: 2, borderColor: '#e2e8f0', color: '#64748b' }}>Batal</Button>
            <Button
              onClick={handleSaveStep}
              variant="contained"
              disabled={stepLoading}
              startIcon={stepLoading ? <CircularProgress size={16} /> : <CheckCircleIcon />}
              sx={{ borderRadius: 2, px: 3, bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
            >
              {stepLoading ? 'Menyimpan...' : 'Perbarui Progres'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Orders;
