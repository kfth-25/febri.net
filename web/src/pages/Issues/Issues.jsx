import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Container,
  Chip,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ReportProblem as ReportIcon
} from '@mui/icons-material';
import { getIssues, createIssue, updateIssue, deleteIssue } from '../../services/issueService';
import { getSubscriptions } from '../../services/subscriptionService';
import { getUsers } from '../../services/userService';
import Layout from '../../components/Layout';
import './Issues.css';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [formData, setFormData] = useState({
    subscription_id: '',
    subject: '',
    description: '',
    priority: 'medium',
    status: 'open',
    technician_id: ''
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  const isTechnician = user.role === 'technician';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [issuesData, subsData] = await Promise.all([
        getIssues(),
        getSubscriptions(isAdmin ? null : 'active') // Customers only see their active subs
      ]);
      setIssues(issuesData);
      setSubscriptions(subsData);

      if (isAdmin) {
        const techs = await getUsers('technician');
        setTechnicians(techs);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Gagal memuat data gangguan.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (issue = null) => {
    if (issue) {
      setEditingIssue(issue);
      setFormData({
        subscription_id: issue.subscription_id,
        subject: issue.subject,
        description: issue.description,
        priority: issue.priority,
        status: issue.status,
        technician_id: issue.technician_id || ''
      });
    } else {
      setEditingIssue(null);
      setFormData({
        subscription_id: '',
        subject: '',
        description: '',
        priority: 'medium',
        status: 'open',
        technician_id: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIssue(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingIssue) {
        await updateIssue(editingIssue.id, formData);
      } else {
        await createIssue(formData);
      }
      fetchData();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save issue:', err);
      setError('Gagal menyimpan laporan gangguan.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        await deleteIssue(id);
        fetchData();
      } catch (err) {
        console.error('Failed to delete issue:', err);
        setError('Gagal menghapus laporan gangguan.');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'error';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      default: return priority;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return 'Terbuka';
      case 'in_progress': return 'Sedang Dikerjakan';
      case 'resolved': return 'Teratasi';
      case 'closed': return 'Ditutup';
      default: return status;
    }
  };

  const getPriorityChipClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-chip-high';
      case 'medium': return 'priority-chip-medium';
      case 'low': return 'priority-chip-low';
      default: return '';
    }
  };

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'open': return 'status-chip-open';
      case 'in_progress': return 'status-chip-in-progress';
      case 'resolved': return 'status-chip-resolved';
      case 'closed': return 'status-chip-closed';
      default: return '';
    }
  };

  return (
    <Layout title="Laporan Gangguan">
      <div className="issues-container">
        <Container maxWidth="xl">
          <div className="issues-header">
            <Typography variant="h5" className="issues-title">
              Daftar Laporan Gangguan
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Buat Laporan Baru
            </Button>
          </div>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Paper className="issues-table-card">
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Subjek</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Pelanggan</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Prioritas</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Teknisi</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={30} />
                      </TableCell>
                    </TableRow>
                  ) : issues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        Belum ada laporan gangguan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    issues.map((issue) => (
                      <TableRow
                        key={issue.id}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#fef2f2', color: '#ef4444', mr: 2 }}>
                                <ReportIcon fontSize="small" />
                            </Box>
                            <Box>
                                <Typography variant="body2" fontWeight={500}>{issue.subject}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 200, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {issue.description}
                                </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {issue.subscription?.user?.name || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getPriorityLabel(issue.priority)} 
                            size="small" 
                            className={getPriorityChipClass(issue.priority)}
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusLabel(issue.status)} 
                            size="small" 
                            className={getStatusChipClass(issue.status)}
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          {issue.technician ? issue.technician.name : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Belum ditugaskan</span>}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton color="primary" onClick={() => handleOpenDialog(issue)} size="small" sx={{ mr: 1 }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(issue.id)} size="small">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle className="dialog-header">
              <Typography variant="h6" fontWeight={600}>
                {editingIssue ? 'Edit Laporan' : 'Buat Laporan Baru'}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box component="form" sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      margin="normal"
                      required
                      fullWidth
                      label="Langganan Terkait"
                      value={formData.subscription_id}
                      onChange={(e) => setFormData({ ...formData, subscription_id: e.target.value })}
                      disabled={!!editingIssue} // Cannot change subscription once created
                      sx={{ mb: 2 }}
                    >
                      {subscriptions.map((sub) => (
                        <MenuItem key={sub.id} value={sub.id}>
                          #{sub.id} - {sub.wifi_package?.name} ({sub.installation_address})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Subjek Gangguan"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Contoh: Internet Mati Total"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Deskripsi Detail"
                      multiline
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      margin="normal"
                      required
                      fullWidth
                      label="Prioritas"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      sx={{ mb: 2 }}
                    >
                      <MenuItem value="low">Rendah</MenuItem>
                      <MenuItem value="medium">Sedang</MenuItem>
                      <MenuItem value="high">Tinggi</MenuItem>
                    </TextField>
                  </Grid>
                  {isAdmin && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          margin="normal"
                          fullWidth
                          label="Tugaskan Teknisi"
                          value={formData.technician_id}
                          onChange={(e) => setFormData({ ...formData, technician_id: e.target.value })}
                          sx={{ mb: 2 }}
                        >
                          <MenuItem value="">-- Belum Ditugaskan --</MenuItem>
                          {technicians.map((tech) => (
                            <MenuItem key={tech.id} value={tech.id}>
                              {tech.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          margin="normal"
                          required
                          fullWidth
                          label="Status"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          sx={{ mb: 2 }}
                        >
                          <MenuItem value="open">Terbuka</MenuItem>
                          <MenuItem value="in_progress">Sedang Dikerjakan</MenuItem>
                          <MenuItem value="resolved">Teratasi</MenuItem>
                          <MenuItem value="closed">Ditutup</MenuItem>
                        </TextField>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions className="dialog-footer">
              <Button onClick={handleCloseDialog} color="inherit" sx={{ textTransform: 'none' }}>
                Batal
              </Button>
              <Button onClick={handleSubmit} variant="contained" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
                Simpan
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </Layout>
  );
};

export default Issues;
