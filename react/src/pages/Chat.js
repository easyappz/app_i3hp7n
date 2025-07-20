import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

const Chat = () => {
  const { userId } = useParams();
  return (
    <Box>
      <Typography variant="h4">Чат с пользователем {userId}</Typography>
      {/* Здесь будет чат */}
    </Box>
  );
};

export default Chat;
