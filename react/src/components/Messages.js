import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, List, ListItem, ListItemAvatar, ListItemText, ListItemButton, Avatar, Typography, Divider } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { instance } from '../api/axios';
import jwtDecode from 'jwt-decode';

const POLLING_INTERVAL = 5000; // 5 seconds

function Messages() {
  const [dialogs, setDialogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDialogs = async () => {
    try {
      const response = await instance.get('/api/dialogs');
      setDialogs(response.data);
      setLoading(false);
    } catch (err) {
      setError('Ошибка загрузки диалогов');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDialogs();
    const interval = setInterval(fetchDialogs, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Box><Typography>Загрузка...</Typography></Box>;
  }

  if (error) {
    return <Box><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h5" gutterBottom>Сообщения</Typography>
      <List>
        {dialogs.map((dialog) => (
          <React.Fragment key={dialog.dialogId}>
            <ListItemButton onClick={() => navigate(`/messages/${dialog.otherUserId}`)}>
              <ListItemAvatar>
                <Avatar>{dialog.otherUserName ? dialog.otherUserName[0] : '?'}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={dialog.otherUserName || 'Неизвестный пользователь'}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {dialog.lastMessage ? `${dialog.lastMessage.from}: ${dialog.lastMessage.content.substring(0, 50)}...` : 'Нет сообщений'}
                    </Typography>
                    {' — '}
                    {dialog.lastMessage ? formatDistanceToNow(new Date(dialog.lastMessage.createdAt), { addSuffix: true, locale: ru }) : ''}
                  </>
                }
              />
            </ListItemButton>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default Messages;
