import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Container, Avatar, Chip,
  IconButton, Tooltip, Divider, TextField, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel, Alert, Fab
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Forum as ForumIcon,
  AddComment as AddCommentIcon,
  Add as AddIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const TYPE_OPTS = ['Laporan Gangguan', 'Info Resmi', 'Diskusi'];

const TYPE_META = {
  'Laporan Gangguan': { color: '#ea580c', bg: '#fff7ed', icon: <WarningIcon sx={{ fontSize: 13 }} /> },
  'Info Resmi':       { color: '#2563eb', bg: '#eff6ff', icon: <InfoIcon    sx={{ fontSize: 13 }} /> },
  'Diskusi':          { color: '#0891b2', bg: '#e0f2fe', icon: <ForumIcon   sx={{ fontSize: 13 }} /> },
};

const AVATARS = ['B','S','R','A','H','CS'];
const AVATAR_COLORS = { B:'#f97316', S:'#ec4899', R:'#7c3aed', A:'#0ea5e9', H:'#10b981', CS:'#3b82f6' };

const INITIAL_POSTS = [
  {
    id: 'p1', author: 'Budi Santoso', avatar: 'B', color: '#f97316', userId: 10,
    location: 'RT 03 Area A', time: '10 mnt lalu',
    type: 'Laporan Gangguan',
    content: 'Internet di rumah saya putus total dari tadi pagi sekitar jam 06.00. Sudah coba restart modem tapi tetap tidak bisa connect. Ada yang sama?',
    tags: ['RT 03, Area A', 'Tidak ada koneksi'],
    impacted: 18, comments: 2, pinned: false,
  },
  {
    id: 'p2', author: 'CS Febri.net', avatar: 'CS', color: '#3b82f6', userId: 0,
    location: 'Pengumuman Resmi', time: '25 mnt lalu',
    type: 'Info Resmi',
    content: 'Pemberitahuan pemeliharaan jaringan pukul 22.00–02.00 WIB untuk Area A dan B. Mohon maaf atas ketidaknyamanannya.',
    tags: ['Area A & B', '22.00–02.00 WIB'],
    impacted: 3, comments: 1, pinned: true,
  },
  {
    id: 'p3', author: 'Rudi Hermawan', avatar: 'R', color: '#7c3aed', userId: 12,
    location: 'RT 02 Area A', time: '3 jam lalu',
    type: 'Diskusi',
    content: 'Ada yang tahu paket paling bagus buat streaming 4K? Sekarang pakai 20Mbps tapi sering buffering kalau malam.',
    tags: ['Streaming', 'Tanya paket'],
    impacted: 6, comments: 3, pinned: false,
  },
];

const FILTERS = ['Semua', 'Laporan Gangguan', 'Info Resmi', 'Diskusi'];

let postIdCounter = 100;

const CommunityAdmin = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [filter, setFilter] = useState('Semua');
  const [replyId, setReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Create Post dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [newPost, setNewPost] = useState({ type: 'Info Resmi', content: '', location: 'Pengumuman Resmi', tags: '' });
  const [createError, setCreateError] = useState('');

  const displayed = filter === 'Semua' ? posts : posts.filter(p => p.type === filter);

  const handleDelete = (id) => setPosts(prev => prev.filter(p => p.id !== id));
  const handlePin = (id) => setPosts(prev => prev.map(p => p.id === id ? { ...p, pinned: !p.pinned } : p));

  const handleReply = (id) => {
    if (!replyText.trim()) return;
    setPosts(prev => prev.map(p => p.id === id ? { ...p, comments: p.comments + 1 } : p));
    setReplyText('');
    setReplyId(null);
  };

  // Click avatar → go to chat with that user
  const handleAvatarClick = (post) => {
    if (!post.userId) return; // skip CS posts
    const params = new URLSearchParams({
      userId: post.userId,
      name: post.author,
      avatar: post.avatar,
      color: post.color,
    });
    navigate(`/chat?${params.toString()}`);
  };

  // Create new post as admin/CS
  const handleCreatePost = () => {
    if (!newPost.content.trim()) { setCreateError('Konten tidak boleh kosong.'); return; }
    const tags = newPost.tags ? newPost.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    setPosts(prev => [{
      id: `p${++postIdCounter}`,
      author: 'CS Febri.net', avatar: 'CS', color: '#3b82f6', userId: 0,
      location: newPost.location || 'Pengumuman Resmi',
      time: 'Baru saja',
      type: newPost.type,
      content: newPost.content,
      tags,
      impacted: 0, comments: 0, pinned: newPost.type === 'Info Resmi',
    }, ...prev]);
    setNewPost({ type: 'Info Resmi', content: '', location: 'Pengumuman Resmi', tags: '' });
    setCreateError('');
    setCreateOpen(false);
  };

  return (
    <Layout title="Moderasi Komunitas">
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Komunitas Pelanggan</Typography>
            <Typography variant="body2" color="text.secondary">
              Moderasi postingan & buat pengumuman gangguan atau info resmi sebagai CS.
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<CampaignIcon />} onClick={() => setCreateOpen(true)}
            sx={{ borderRadius: 2, fontWeight: 700 }}>
            Buat Postingan
          </Button>
        </Box>

        {/* Summary */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
          {[
            { label: `${posts.filter(p => p.type === 'Laporan Gangguan').length} Laporan Gangguan`, color: '#ea580c', bg: '#fff7ed' },
            { label: `${posts.filter(p => p.type === 'Info Resmi').length} Info Resmi`, color: '#2563eb', bg: '#eff6ff' },
            { label: `${posts.filter(p => p.type === 'Diskusi').length} Diskusi`, color: '#0891b2', bg: '#e0f2fe' },
            { label: `${posts.filter(p => p.pinned).length} Dipasang`, color: '#059669', bg: '#f0fdf4' },
          ].map((s, i) => (
            <Box key={i} sx={{ px: 2, py: 0.75, borderRadius: 2, bgcolor: s.bg, border: `1px solid ${s.color}22` }}>
              <Typography variant="body2" fontWeight={700} sx={{ color: s.color }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Filter tabs */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <Chip key={f} label={f} onClick={() => setFilter(f)}
              variant={filter === f ? 'filled' : 'outlined'} color={filter === f ? 'primary' : 'default'}
              sx={{ fontWeight: 600, cursor: 'pointer', borderRadius: 2 }} />
          ))}
        </Box>

        {/* Posts */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {displayed.length === 0 ? (
            <Paper elevation={1} sx={{ p: 6, borderRadius: 3, textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <ForumIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1 }} />
              <Typography color="text.secondary">Tidak ada postingan.</Typography>
            </Paper>
          ) : displayed.map(post => {
            const meta = TYPE_META[post.type] || TYPE_META['Diskusi'];
            return (
              <Paper key={post.id} elevation={1} sx={{
                p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0',
                borderLeft: post.pinned ? '4px solid #3b82f6' : '1px solid #e2e8f0',
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Tooltip title={post.userId ? `Chat dengan ${post.author}` : 'Postingan CS'}>
                      <Avatar
                        onClick={() => handleAvatarClick(post)}
                        sx={{
                          bgcolor: post.color, width: 38, height: 38, fontWeight: 700, fontSize: 14,
                          cursor: post.userId ? 'pointer' : 'default',
                          transition: 'transform 0.15s',
                          '&:hover': post.userId ? { transform: 'scale(1.08)', boxShadow: '0 0 0 3px #bfdbfe' } : {},
                        }}>
                        {post.avatar}
                      </Avatar>
                    </Tooltip>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={700}>{post.author}</Typography>
                        {post.pinned && <Chip label="📌 Dipasang" size="small" color="info" sx={{ height: 18, fontSize: 10, fontWeight: 700 }} />}
                      </Box>
                      <Typography variant="caption" color="text.secondary">{post.location} · {post.time}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title={post.pinned ? 'Lepas Pin' : 'Pin Postingan'}>
                      <IconButton size="small" onClick={() => handlePin(post.id)}
                        sx={{ bgcolor: post.pinned ? '#eff6ff' : '#f8fafc', color: post.pinned ? '#3b82f6' : '#94a3b8' }}>
                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Balas sebagai CS">
                      <IconButton size="small" onClick={() => setReplyId(replyId === post.id ? null : post.id)}
                        sx={{ bgcolor: '#f0fdf4', color: '#059669' }}>
                        <AddCommentIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    {post.userId !== 0 && (
                      <Tooltip title={`Chat dengan ${post.author}`}>
                        <IconButton size="small"
                          onClick={() => handleAvatarClick(post)}
                          sx={{ bgcolor: '#eff6ff', color: '#3b82f6' }}>
                          <ForumIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Hapus Postingan">
                      <IconButton size="small" onClick={() => handleDelete(post.id)}
                        sx={{ bgcolor: '#fef2f2', color: '#ef4444' }}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Type badge */}
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.5, borderRadius: 1.5, bgcolor: meta.bg, mb: 1.25 }}>
                  {React.cloneElement(meta.icon, { sx: { fontSize: 13, color: meta.color } })}
                  <Typography variant="caption" fontWeight={700} sx={{ color: meta.color }}>{post.type}</Typography>
                </Box>

                <Typography variant="body2" sx={{ lineHeight: 1.65, color: '#1e293b', mb: 1.5 }}>{post.content}</Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
                  {post.tags.map(tag => (
                    <Box key={tag} sx={{ px: 1.25, py: 0.4, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary">{tag}</Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ borderColor: '#f1f5f9', mb: 1.25 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {post.impacted > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      <b style={{ color: '#ea580c' }}>{post.impacted}</b> pengguna terdampak
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    <b>{post.comments}</b> komentar
                  </Typography>
                </Box>

                {replyId === post.id && (
                  <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth size="small"
                      placeholder="Balas sebagai CS Febri.net..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      multiline maxRows={3}
                    />
                    <Button variant="contained" size="small" onClick={() => handleReply(post.id)}
                      sx={{ borderRadius: 2, px: 2, flexShrink: 0, height: 40, alignSelf: 'flex-end' }}>
                      Kirim
                    </Button>
                  </Box>
                )}
              </Paper>
            );
          })}
        </Box>

        {/* Create Post Dialog */}
        <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ pt: 3, px: 3, pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#eff6ff' }}>
                <CampaignIcon sx={{ color: '#3b82f6', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>Buat Postingan CS</Typography>
                <Typography variant="caption" color="text.secondary">Posting pengumuman, info resmi, atau peringatan gangguan.</Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ px: 3, pb: 1 }}>
            {createError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{createError}</Alert>}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1.5 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Jenis Postingan</InputLabel>
                <Select value={newPost.type} label="Jenis Postingan"
                  onChange={e => setNewPost({ ...newPost, type: e.target.value })}
                  sx={{ borderRadius: 2 }}>
                  {TYPE_OPTS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField fullWidth label="Lokasi / Area" size="small"
                placeholder="cth: Area A & B, atau Pengumuman Resmi"
                value={newPost.location}
                onChange={e => setNewPost({ ...newPost, location: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <TextField fullWidth label="Konten Postingan" multiline rows={4}
                placeholder="Tulis pengumuman atau peringatan di sini..."
                value={newPost.content}
                onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <TextField fullWidth label="Tags (pisahkan dengan koma)" size="small"
                placeholder="cth: Area A, Pemeliharaan, Malam ini"
                value={newPost.tags}
                onChange={e => setNewPost({ ...newPost, tags: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
            <Button onClick={() => setCreateOpen(false)} variant="outlined" color="inherit"
              sx={{ borderRadius: 2, borderColor: '#e2e8f0', color: '#64748b' }}>Batal</Button>
            <Button onClick={handleCreatePost} variant="contained" sx={{ borderRadius: 2, px: 3 }}>
              Publikasikan
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default CommunityAdmin;
