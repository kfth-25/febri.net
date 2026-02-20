
import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Fab, Fade, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../context/AuthContext';

const ChatWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Halo! Saya AI Assistant Febri.net. Ada yang bisa saya bantu?", sender: 'ai' }
    ]);
    const [hasGreeted, setHasGreeted] = useState(false);

    // Auto-greet when user logs in
    useEffect(() => {
        if (user && !hasGreeted) {
            // Check if already greeted in this session
            const sessionGreeted = sessionStorage.getItem(`greeted_${user.id}`);
            
            if (!sessionGreeted) {
                // Delay sedikit biar natural setelah loading
                const timer = setTimeout(() => {
                    setIsOpen(true);
                    setMessages(prev => [
                        ...prev, 
                        { text: `Halo ${user.name}! Selamat datang kembali di Febri.net. Ada yang bisa saya bantu?`, sender: 'ai' }
                    ]);
                    setHasGreeted(true);
                    sessionStorage.setItem(`greeted_${user.id}`, 'true');
                }, 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [user, hasGreeted]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:8001/api/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });
            
            const data = await response.json();
            
            setTimeout(() => {
                setMessages(prev => [...prev, { text: data.response || "Maaf, terjadi kesalahan.", sender: 'ai' }]);
                setIsTyping(false);
            }, 500); // Simulate network delay for natural feel
            
        } catch (error) {
            console.error('Error sending message:', error);
            setIsTyping(false);
            setMessages(prev => [...prev, { text: "Maaf, server AI sedang offline.", sender: 'ai' }]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}>
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.1 }}
                        >
                            <Fab 
                                color="secondary" 
                                aria-label="chat"
                                onClick={() => setIsOpen(true)}
                                sx={{ 
                                    width: 60, 
                                    height: 60,
                                    boxShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
                                    background: 'linear-gradient(45deg, #00e5ff 30%, #00b0ff 90%)'
                                }}
                            >
                                <SmartToyIcon sx={{ fontSize: 30, color: 'white' }} />
                            </Fab>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <Box 
                        sx={{ 
                            position: 'fixed', 
                            bottom: 100, 
                            right: 30, 
                            zIndex: 1000,
                            width: { xs: '90%', sm: 350 },
                            maxWidth: '100%'
                        }}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Paper 
                                elevation={10}
                                sx={{ 
                                    overflow: 'hidden', 
                                    borderRadius: 4,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
                                }}
                            >
                                {/* Header */}
                                <Box sx={{ 
                                    p: 2, 
                                    bgcolor: 'primary.main', 
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{ 
                                            p: 1, 
                                            bgcolor: 'rgba(255,255,255,0.15)', 
                                            borderRadius: '50%',
                                            display: 'flex'
                                        }}>
                                            <SmartToyIcon fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
                                                Febri AI
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                Online • Siap membantu
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>

                                {/* Messages Area */}
                                <Box sx={{ 
                                    height: 350, 
                                    overflowY: 'auto', 
                                    p: 2,
                                    bgcolor: '#f8fafc',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1.5
                                }}>
                                    {messages.map((msg, idx) => (
                                        <Box 
                                            key={idx} 
                                            sx={{ 
                                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                                maxWidth: '80%'
                                            }}
                                        >
                                            <Paper 
                                                elevation={0}
                                                sx={{ 
                                                    p: 1.5, 
                                                    px: 2,
                                                    borderRadius: 2,
                                                    borderTopLeftRadius: msg.sender === 'user' ? 2 : 0,
                                                    borderTopRightRadius: msg.sender === 'user' ? 0 : 2,
                                                    bgcolor: msg.sender === 'user' ? 'secondary.main' : 'white',
                                                    color: msg.sender === 'user' ? 'white' : 'text.primary',
                                                    border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0'
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                                    {msg.text}
                                                </Typography>
                                            </Paper>
                                            <Typography variant="caption" sx={{ 
                                                display: 'block', 
                                                mt: 0.5, 
                                                textAlign: msg.sender === 'user' ? 'right' : 'left',
                                                color: 'text.secondary',
                                                fontSize: '0.7rem'
                                            }}>
                                                {msg.sender === 'user' ? 'Anda' : 'AI Assistant'}
                                            </Typography>
                                        </Box>
                                    ))}
                                    {isTyping && (
                                        <Box sx={{ alignSelf: 'flex-start' }}>
                                            <Paper sx={{ p: 1.5, px: 2, borderRadius: 2, bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Sedang mengetik...
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    )}
                                    <div ref={messagesEndRef} />
                                </Box>

                                {/* Input Area */}
                                <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid', borderColor: 'divider' }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Ketik pesan..."
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            sx={{ 
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3
                                                }
                                            }}
                                        />
                                        <IconButton 
                                            color="secondary" 
                                            onClick={handleSend}
                                            disabled={!input.trim()}
                                            sx={{ 
                                                bgcolor: 'secondary.main', 
                                                color: 'white',
                                                '&:hover': { bgcolor: 'secondary.dark' },
                                                '&.Mui-disabled': { bgcolor: 'action.disabledBackground' }
                                            }}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Paper>
                        </motion.div>
                    </Box>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;
