import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import jwt_decode from 'jwt-decode';
import { Box, Button, TextField, Typography, Container, Paper, Avatar, Divider, Grid, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { instance } from '../api/axios';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!user) return <Typography>Загрузка...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ height: 300, backgroundColor: '#e9ebee', position: 'relative' }}>
          {/* Cover photo placeholder */}
          <Avatar
            sx={{ width: 150, height: 150, position: 'absolute', bottom: -75, left: 20, border: '4px solid white' }}
            src="/placeholder-avatar.png"
          />
        </Box>
        <Box sx={{ pt: 10, px: 3 }}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography variant="h4">{user.username}</Typography>
              <Typography variant="subtitle1" color="text.secondary">{user.email}</Typography>
            </Grid>
            {isOwnProfile && (
              <Grid item>
                <IconButton onClick={() => setIsEditing(!isEditing)}>
                  <EditIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
          <Divider sx={{ my: 2 }} />
          {isOwnProfile && isEditing ? (
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
              <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: '#1877f2' }}>
                Сохранить изменения
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1">Информация о профиле</Typography>
              {/* Add more view-only info like friends count, bio if available */}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
