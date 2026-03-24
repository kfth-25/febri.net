import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Container, Avatar, Chip,
  IconButton, Tooltip, Divider, TextField, Badge, Button,
  InputAdornment, List, ListItem, ListItemAvatar, ListItemText,
  Dialog, DialogTitle, DialogContent, Autocomplete
} from '@mui/material';
import {
  Search as SearchIcon,
  Send as SendIcon,
  Chat as ChatIcon,
  Circle as CircleIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getUsers } from '../../services/userService';

// ----- mock conversations store -----
const MOCK_CONVERSATIONS = [
  {
    id: 1, userId: 10, name: 'Budi Santoso', avatar: 'B', color: '#f97316',
    lastMessage: 'Internet di rumah saya mati dari tadi pagi.',
    time: '10 mnt lalu', unread: 2, online: true,
    messages: [
      { from: 'user', text: 'Halo admin, internet saya putus dari pagi.', time: '09:12' },
      { from: 'user', text: 'Sudah coba restart modem tapi tetap tidak bisa.', time: '09:13' },
      { from: 'admin', text: 'Baik Pak Budi, kami cek dulu ya. Mohon tunggu.', time: '09:15' },
    ],
  },
  {
    id: 2, userId: 11, name: 'Siti Rahayu', avatar: 'S', color: '#ec4899',
    lastMessage: 'Kapan teknisi datang?',
    time: '25 mnt lalu', unread: 1, online: true,
    messages: [
      { from: 'user', text: 'Halo, saya sudah buat laporan gangguan kemarin.', time: '08:45' },
      { from: 'admin', text: 'Kami sudah menerima laporan Ibu Siti. Teknisi akan datang hari ini.', time: '08:50' },
      { from: 'user', text: 'Kapan teknisi datang?', time: '09:05' },
    ],
  },
  {
    id: 3, userId: 12, name: 'Rudi Hermawan', avatar: 'R', color: '#7c3aed',
    lastMessage: 'Terima kasih, masalah sudah teratasi.',
    time: '3 jam lalu', unread: 0, online: false,
    messages: [
      { from: 'user', text: 'Internet lambat banget sejak kemarin.', time: '06:30' },
      { from: 'admin', text: 'Sudah kami perbaiki Pak Rudi, silakan coba restart modem.', time: '07:00' },
      { from: 'user', text: 'Terima kasih, masalah sudah teratasi.', time: '07:10' },
    ],
  },
];

const avatarColors = ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#0ea5e9','#ec4899'];
const ac = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

let convIdCounter = 100;

const ChatAdmin = () => {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');

  // New Chat dialog
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // On mount: read URL params to auto-select or create conversation
  useEffect(() => {
    const urlUserId = searchParams.get('userId');
    const urlName   = searchParams.get('name');
    const urlAvatar = searchParams.get('avatar');
    const urlColor  = searchParams.get('color') || '#3b82f6';

    if (urlUserId && urlName) {
      setConversations(prev => {
        const existing = prev.find(c => String(c.userId) === String(urlUserId));
        if (existing) {
          setSelected(existing);
          return prev;
        }
        const newConv = {
          id: ++convIdCounter,
          userId: Number(urlUserId),
          name: urlName,
          avatar: urlAvatar || urlName[0].toUpperCase(),
          color: urlColor,
          lastMessage: 'Percakapan baru dimulai.',
          time: 'Baru saja',
          unread: 0,
          online: false,
          messages: [],
        };
        setSelected(newConv);
        return [newConv, ...prev];
      });
    } else {
      setSelected(MOCK_CONVERSATIONS[0]);
    }
  }, []); // eslint-disable-line

  // Load customers for new chat dialog
  const loadCustomers = async () => {
    if (customers.length) return;
    try {
      const data = await getUsers('customer');
      setCustomers(data);
    } catch { setCustomers([]); }
  };

  const handleOpenNewChat = () => {
    setNewChatOpen(true);
    loadCustomers();
  };

  const handleStartNewChat = () => {
    if (!selectedCustomer) return;
    const existing = conversations.find(c => c.userId === selectedCustomer.id);
    if (existing) { setSelected(existing); setNewChatOpen(false); return; }
    const newConv = {
      id: ++convIdCounter,
      userId: selectedCustomer.id,
      name: selectedCustomer.name,
      avatar: selectedCustomer.name?.[0]?.toUpperCase() || '?',
      color: ac(selectedCustomer.name),
      lastMessage: 'Percakapan baru.',
      time: 'Baru saja',
      unread: 0,
      online: false,
      messages: [],
    };
    setConversations(prev => [newConv, ...prev]);
    setSelected(newConv);
    setNewChatOpen(false);
    setSelectedCustomer(null);
  };

  const filteredConvs = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (!reply.trim() || !selected) return;
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const updatedMsg = { from: 'admin', text: reply, time: now };
    setConversations(prev => prev.map(c =>
      c.id === selected.id
        ? { ...c, messages: [...c.messages, updatedMsg], lastMessage: reply, unread: 0, time: 'Baru saja' }
        : c
    ));
    setSelected(prev => ({ ...prev, messages: [...prev.messages, updatedMsg] }));
    setReply('');
  };

  return (
    <Layout title="Inbox Chat Pelanggan">
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Chat CS — Inbox Admin</Typography>
            <Typography variant="body2" color="text.secondary">Kelola & balas pesan pelanggan WiFi Net.</Typography>
          </Box>
          <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleOpenNewChat}
            sx={{ borderRadius: 2, fontWeight: 700 }}>
            Mulai Chat Baru
          </Button>
        </Box>

        <Paper elevation={1} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', height: '72vh' }}>
            {/* ── Conversation List ── */}
            <Box sx={{ width: 300, flexShrink: 0, borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
                <TextField fullWidth size="small" placeholder="Cari percakapan..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 17, color: '#94a3b8' }} /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Box>
              <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                {filteredConvs.length === 0 ? (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Tidak ada percakapan ditemukan.</Typography>
                  </Box>
                ) : filteredConvs.map((conv, idx) => (
                  <React.Fragment key={conv.id}>
                    <ListItem button selected={selected?.id === conv.id}
                      onClick={() => setSelected(conv)}
                      sx={{ px: 2, py: 1.5, '&.Mui-selected': { bgcolor: '#eff6ff' }, '&:hover': { bgcolor: '#f8fafc' } }}>
                      <ListItemAvatar>
                        <Badge badgeContent={conv.unread} color="error" max={9}>
                          <Box sx={{ position: 'relative' }}>
                            <Avatar sx={{ bgcolor: conv.color, width: 40, height: 40, fontWeight: 700 }}>{conv.avatar}</Avatar>
                            {conv.online && (
                              <CircleIcon sx={{ position: 'absolute', bottom: -1, right: -1, fontSize: 12, color: '#10b981', filter: 'drop-shadow(0 0 1px white)' }} />
                            )}
                          </Box>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight={conv.unread ? 700 : 500}>{conv.name}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary" noWrap>{conv.lastMessage}</Typography>}
                      />
                      <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10, flexShrink: 0, ml: 1 }}>{conv.time}</Typography>
                    </ListItem>
                    {idx < filteredConvs.length - 1 && <Divider sx={{ borderColor: '#f8fafc' }} />}
                  </React.Fragment>
                ))}
              </List>
            </Box>

            {/* ── Chat Panel ── */}
            {selected ? (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Header */}
                <Box sx={{ px: 2.5, py: 1.75, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: selected.color, width: 36, height: 36, fontWeight: 700 }}>{selected.avatar}</Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={700}>{selected.name}</Typography>
                    <Typography variant="caption" sx={{ color: selected.online ? '#10b981' : '#94a3b8', fontWeight: 600 }}>
                      {selected.online ? '● Online' : '○ Offline'}
                    </Typography>
                  </Box>
                </Box>

                {/* Messages */}
                <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {selected.messages.length === 0 && (
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" color="text.disabled">Belum ada pesan. Mulai percakapan di bawah.</Typography>
                    </Box>
                  )}
                  {selected.messages.map((msg, idx) => (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: msg.from === 'admin' ? 'flex-end' : 'flex-start' }}>
                      <Box sx={{
                        maxWidth: '70%', px: 2, py: 1, borderRadius: 2.5,
                        bgcolor: msg.from === 'admin' ? '#0f172a' : '#f1f5f9',
                        color: msg.from === 'admin' ? '#f8fafc' : '#1e293b',
                      }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{msg.text}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.6, float: 'right', ml: 1, fontSize: 10 }}>{msg.time}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Reply box */}
                <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid #f1f5f9', display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField fullWidth size="small" placeholder="Ketik balasan..."
                    value={reply} onChange={e => setReply(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    multiline maxRows={3} />
                  <Tooltip title="Kirim">
                    <IconButton onClick={handleSend}
                      sx={{ bgcolor: '#0f172a', color: '#fff', borderRadius: 2, '&:hover': { bgcolor: '#334155' }, width: 40, height: 40, flexShrink: 0 }}>
                      <SendIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <ChatIcon sx={{ fontSize: 56, color: '#e2e8f0', mb: 2 }} />
                  <Typography color="text.secondary">Pilih percakapan untuk mulai membalas</Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>

        {/* New Chat Dialog — search customers */}
        <Dialog open={newChatOpen} onClose={() => setNewChatOpen(false)} maxWidth="xs" fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ pt: 3, px: 3, pb: 1 }}>
            <Typography variant="h6" fontWeight={700}>Mulai Chat Baru</Typography>
            <Typography variant="caption" color="text.secondary">Cari nama pelanggan untuk memulai percakapan.</Typography>
          </DialogTitle>
          <DialogContent sx={{ px: 3, pb: 3 }}>
            <Autocomplete
              options={customers}
              getOptionLabel={(o) => `${o.name} — ${o.email}`}
              value={selectedCustomer}
              onChange={(_, val) => setSelectedCustomer(val)}
              filterOptions={(opts) => {
                const q = customerSearch.toLowerCase();
                return opts.filter(o =>
                  o.name?.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q)
                );
              }}
              inputValue={customerSearch}
              onInputChange={(_, val) => setCustomerSearch(val)}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                    <Avatar sx={{ width: 30, height: 30, fontSize: 12, fontWeight: 700, bgcolor: ac(option.name) }}>
                      {option.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{option.email}</Typography>
                    </Box>
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Cari Pelanggan" placeholder="Ketik nama atau email..."
                  autoFocus fullWidth sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              )}
              noOptionsText="Tidak ada pelanggan ditemukan"
              loadingText="Memuat pelanggan..."
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 2.5, justifyContent: 'flex-end' }}>
              <Button onClick={() => setNewChatOpen(false)} variant="outlined" color="inherit"
                sx={{ borderRadius: 2, borderColor: '#e2e8f0', color: '#64748b' }}>Batal</Button>
              <Button onClick={handleStartNewChat} variant="contained" sx={{ borderRadius: 2 }}
                disabled={!selectedCustomer}>Mulai Chat</Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default ChatAdmin;
