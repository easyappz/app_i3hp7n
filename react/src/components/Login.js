import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import { instance } from '../api/axios';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await instance.post('/api/login', data);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" color="primary" gutterBottom>
            Вход
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              {...register('email', { required: 'Email обязателен' })}
              error={!!errors.email}
              helperText={errors.email?.message}
              variant="outlined"
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
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, py: 1.5, fontSize: '1rem' }}>
              Войти
            </Button>
            <Button fullWidth variant="text" onClick={() => navigate('/register')} sx={{ mt: 1 }}>
              Нет аккаунта? Зарегистрироваться
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
