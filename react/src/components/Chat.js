import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, TextField, IconButton, Paper, Typography, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { instance } from '../api/axios';
import jwtDecode from 'jwt-decode';

const POLLING_INTERVAL = 3000; // 3 seconds for more responsive chat

function Chat() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : {};
  const currentUserId = decoded.userId; // Assuming token payload has userId

  const fetchMessages = async () => {
    try {
      const response = await instance.get(`/api/dialogs/${userId}`);
      setMessages(response.data);
      setLoading(false);
    } catch (err) {
      setError('Ошибка загрузки сообщений');
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await instance.post('/api/messages', { to: userId, content: newMessage });
      setNewMessage('');
      fetchMessages(); // Refetch after send
    } catch (err) {
      setError('Ошибка отправки сообщения');
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return <Box><Typography>Загрузка...</Typography></Box>;
  }

  if (error) {
    return <Box><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        Чат с пользователем {userId}
      </Typography>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((msg) => {
          const isMe = msg.from._id === currentUserId;
          return (
            <Box key={msg._id} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', mb: 2 }}>
              {!isMe && <Avatar sx={{ mr: 1 }}>{msg.from.username[0]}</Avatar>}
              <Paper
                elevation={1}
                sx={{
                  p: 1,
                  maxWidth: '70%',
                  backgroundColor: isMe ? '#DCF8C6' : '#FFFFFF',
                  borderRadius: isMe ? '20px 20px 0 20px' : '20px 20px 20px 0',
                }}
              >
                <Typography variant="body2">{msg.content}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(msg.createdAt), 'HH:mm', { locale: ru })}
                </Typography>
              </Paper>
              {isMe && <Avatar sx={{ ml: 1 }}>{msg.from.username[0]}</Avatar>}
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ display: 'flex', p: 2, borderTop: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Введите сообщение..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <IconButton color="primary" onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Chat;
