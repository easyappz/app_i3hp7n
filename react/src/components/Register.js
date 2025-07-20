import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import { instance } from '../api/axios';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await instance.post('/api/register', data);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FacebookIcon sx={{ fontSize: 60, color: '#1877f2', mb: 2 }} />
          <Typography component="h1" variant="h5" color="text.primary" gutterBottom>
            Создать новый аккаунт
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Это бесплатно и всегда будет бесплатно
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              label="Имя пользователя"
              {...register('username', { required: 'Имя пользователя обязательно' })}
              error={!!errors.username}
              helperText={errors.username?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email или телефон"
              {...register('email', { required: 'Email обязателен' })}
              error={!!errors.email}
              helperText={errors.email?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Пароль"
              type="password"
              {...register('password', { required: 'Пароль обязателен' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, py: 1.5, fontSize: '1rem', backgroundColor: '#1877f2', borderRadius: 2 }}>
              Зарегистрироваться
            </Button>
            <Button fullWidth variant="text" onClick={() => navigate('/login')} sx={{ mt: 1 }}>
              Уже есть аккаунт? Войти
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
