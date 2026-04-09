import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Paper, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert, CircularProgress,
  Container, Chip, MenuItem, Grid, Avatar, InputAdornment, Tooltip
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Search as SearchIcon, ReportProblem as ReportIcon, Close as CloseIcon
} from '@mui/icons-material';
import { getIssues, createIssue, updateIssue, deleteIssue } from '../../services/issueService';
import { getSubscriptions } from '../../services/subscriptionService';
import { getUsers } from '../../services/userService';
import Layout from '../../components/Layout';

const PRIORITY_COLOR = { high: 'error', medium: 'warning', low: 'success' };
const PRIORITY_LABEL = { high: 'Tinggi', medium: 'Sedang', low: 'Rendah' };
const STATUS_COLOR = { open: 'error', in_progress: 'warning', resolved: 'success', closed: 'default' };
const STATUS_LABEL = { open: 'Terbuka', in_progress: 'Dikerjakan', resolved: 'Teratasi', closed: 'Ditutup' };
const STATUS_FILTERS = ['Semua', 'open', 'in_progress', 'resolved', 'closed'];

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [formData, setFormData] = useState({ subscription_id: '', subject: '', description: '', priority: 'medium', status: 'open', technician_id: '' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [issuesData, subsData] = await Promise.all([getIssues(), getSubscriptions(isAdmin ? null : 'active')]);
      setIssues(issuesData); setSubscriptions(subsData);
      if (isAdmin) { const techs = await getUsers('technician'); setTechnicians(techs); }
    } catch (err) { setError('Gagal memuat data gangguan.'); }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => {
    let list = issues;
    if (statusFilter !== 'Semua') list = list.filter(i => i.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i => i.subject?.toLowerCase().includes(q) || i.subscription?.user?.name?.toLowerCase().includes(q));
    }
    return list;
  }, [issues, statusFilter, search]);

  const handleOpenDialog = (issue = null) => {
    if (issue) {
      setEditingIssue(issue);
      setFormData({ subscription_id: issue.subscription_id, subject: issue.subject, description: issue.description, priority: issue.priority, status: issue.status, technician_id: issue.technician_id || '' });
    } else {
      setEditingIssue(null);
      setFormData({ subscription_id: '', subject: '', description: '', priority: 'medium', status: 'open', technician_id: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => { setOpenDialog(false); setEditingIssue(null); };

  const handleSubmit = async () => {
    try {
      if (editingIssue) { await updateIssue(editingIssue.id, formData); }
      else { await createIssue(formData); }
      fetchData(); handleCloseDialog();
    } catch (err) { setError('Gagal menyimpan laporan gangguan.'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus laporan ini?')) {
      try { await deleteIssue(id); fetchData(); }
      catch (err) { setError('Gagal menghapus laporan.'); }
    }
  };

  const avatarColor = (name) => {
    const colors = ['#ef4444','#f59e0b','#8b5cf6','#3b82f6','#10b981','#0ea5e9'];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  return (
    <Layout title="Laporan Gangguan">
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Daftar Laporan Gangguan</Typography>
            <Typography variant="body2" color="text.secondary">{issues.length} total laporan</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ borderRadius: 2, px: 2.5 }}>
            Buat Laporan Baru
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Cari subjek atau pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
              endAdornment: search ? (<InputAdornment position="end"><IconButton size="small" onClick={() => setSearch('')}><CloseIcon sx={{ fontSize: 16 }} /></IconButton></InputAdornment>) : null,
            }}
            sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { borderRadius: 2 }, width: 320 }}
          />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {STATUS_FILTERS.map((f) => (
              <Chip key={f} label={f === 'Semua' ? 'Semua' : STATUS_LABEL[f]} onClick={() => setStatusFilter(f)}
                variant={statusFilter === f ? 'filled' : 'outlined'} color={statusFilter === f ? 'primary' : 'default'}
                sx={{ fontWeight: 600, cursor: 'pointer', borderRadius: 2 }} />
            ))}
          </Box>
        </Box>

        <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subjek</TableCell>
                  <TableCell>Pelanggan</TableCell>
                  <TableCell>Prioritas</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Teknisi</TableCell>
                  <TableCell align="right">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={30} /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <ReportIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1, display: 'block', mx: 'auto' }} />
                      <Typography color="text.secondary">Tidak ada laporan ditemukan.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#fef2f2', color: '#ef4444', flexShrink: 0 }}>
                            <ReportIcon sx={{ fontSize: 18 }} />
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{issue.subject}</Typography>
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 220, display: 'block' }}>{issue.description}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: 12, fontWeight: 700, bgcolor: avatarColor(issue.subscription?.user?.name) }}>
                            {issue.subscription?.user?.name?.[0]?.toUpperCase() || '?'}
                          </Avatar>
                          <Typography variant="body2">{issue.subscription?.user?.name || 'Unknown'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={PRIORITY_LABEL[issue.priority] || issue.priority} size="small" color={PRIORITY_COLOR[issue.priority] || 'default'} sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={STATUS_LABEL[issue.status] || issue.status} size="small" color={STATUS_COLOR[issue.status] || 'default'} sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>
                        {issue.technician ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: '#0ea5e9' }}>{issue.technician.name?.[0]}</Avatar>
                            <Typography variant="body2">{issue.technician.name}</Typography>
                          </Box>
                        ) : <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>Belum ditugaskan</Typography>}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleOpenDialog(issue)} sx={{ mr: 0.5, bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}><EditIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                        <Tooltip title="Hapus"><IconButton size="small" color="error" onClick={() => handleDelete(issue.id)} sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
            <Typography variant="h6" fontWeight={700}>{editingIssue ? 'Edit Laporan' : 'Buat Laporan Baru'}</Typography>
          </DialogTitle>
          <DialogContent sx={{ px: 3, pb: 1 }}>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12}>
                <TextField select required fullWidth label="Langganan Terkait" value={formData.subscription_id}
                  onChange={(e) => setFormData({...formData, subscription_id: e.target.value})} disabled={!!editingIssue}>
                  {subscriptions.map((s) => (<MenuItem key={s.id} value={s.id}>#{s.id} - {s.wifi_package?.name} ({s.installation_address})</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label="Subjek Gangguan" value={formData.subject} placeholder="Contoh: Internet Mati Total"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label="Deskripsi Detail" multiline rows={3} value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select required fullWidth label="Prioritas" value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                  <MenuItem value="low">Rendah</MenuItem>
                  <MenuItem value="medium">Sedang</MenuItem>
                  <MenuItem value="high">Tinggi</MenuItem>
                </TextField>
              </Grid>
              {isAdmin && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField select fullWidth label="Tugaskan Teknisi" value={formData.technician_id}
                      onChange={(e) => setFormData({...formData, technician_id: e.target.value})}>
                      <MenuItem value="">— Belum Ditugaskan —</MenuItem>
                      {technicians.map((t) => (<MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField select required fullWidth label="Status" value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <MenuItem value="open">Terbuka</MenuItem>
                      <MenuItem value="in_progress">Sedang Dikerjakan</MenuItem>
                      <MenuItem value="resolved">Teratasi</MenuItem>
                      <MenuItem value="closed">Ditutup</MenuItem>
                    </TextField>
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
            <Button onClick={handleCloseDialog} variant="outlined" color="inherit" sx={{ borderRadius: 2, borderColor: '#e2e8f0', color: '#64748b' }}>Batal</Button>
            <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2, px: 3 }}>Simpan</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Issues;
