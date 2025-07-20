import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

const Profile = () => {
  const { id } = useParams();
  return (
    <Box>
      <Typography variant="h4">Профиль пользователя {id}</Typography>
      {/* Здесь будет профиль, похожий на Facebook */}
    </Box>
  );
};

export default Profile;
