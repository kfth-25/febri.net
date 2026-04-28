require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for now (can be restricted later)
    methods: ['GET', 'POST']
  }
});

// Endpoint untuk Laravel (API) me-request broadcast message ke Socket.io
app.post('/api/broadcast', (req, res) => {
  const { event, channel, data } = req.body;

  if (!event) {
    return res.status(400).json({ error: 'Event is required' });
  }

  if (channel) {
    // Broadcast ke spesifik room/channel (misal: user-1, admin, dll)
    io.to(channel).emit(event, data);
    console.log(`[HTTP Broadcast] -> Channel: ${channel} | Event: ${event}`);
  } else {
    // Broadcast ke semua client
    io.emit(event, data);
    console.log(`[HTTP Broadcast] -> Global | Event: ${event}`);
  }

  res.json({ success: true, message: 'Broadcast sent' });
});

// Menghandle koneksi dari clients (Mobile App & Web Admin)
io.on('connection', (socket) => {
  console.log(`Client Connected: ${socket.id}`);

  // User bergabung ke channel spesifik (misal: "user-123" atau "admin")
  socket.on('join_channel', (channel) => {
    socket.join(channel);
    console.log(`Socket ${socket.id} joined channel: ${channel}`);
  });

  // User keluar channel
  socket.on('leave_channel', (channel) => {
    socket.leave(channel);
    console.log(`Socket ${socket.id} left channel: ${channel}`);
  });

  // Chat message antar user (Opsional, jika mau handle langsung tanpa HTTP API)
  socket.on('send_message', (payload) => {
    const { channel, message } = payload;
    // Broadcast ke lawan bicara di channel tsb
    socket.to(channel).emit('receive_message', payload);
  });

  socket.on('disconnect', () => {
    console.log(`Client Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '192.168.1.3', () => {
  console.log(`Socket.IO Server berjalan di http://192.168.1.3:${PORT}`);
});
