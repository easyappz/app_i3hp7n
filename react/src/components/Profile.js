import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import jwt_decode from 'jwt-decode';
import { Box, Button, TextField, Typography, Container, Paper, Avatar, Divider } from '@mui/material';
import { instance } from '../api/axios';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const decoded = jwt_decode(token);
    const currentUserId = decoded.userId;
    setIsOwnProfile(id === currentUserId);

    const fetchUser = async () => {
      try {
        const response = await instance.get(`/api/profile/${id}`);
        setUser(response.data);
        reset(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchUser();
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await instance.put('/api/profile', data);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!user) return <Typography>Загрузка...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 100, height: 100, mr: 3 }} />
          <Box>
            <Typography variant="h4">{user.username}</Typography>
            <Typography variant="subtitle1" color="text.secondary">{user.email}</Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {isOwnProfile ? (
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal"
              fullWidth
              label="Имя пользователя"
              {...register('username', { required: 'Имя пользователя обязательно' })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              {...register('email', { required: 'Email обязателен' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Сохранить изменения
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1">Информация о профиле</Typography>
            {/* Additional view-only info */}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
