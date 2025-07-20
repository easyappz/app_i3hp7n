import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { instance } from '../api/axios';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await instance.post('/auth/register', data);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Регистрация</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            fullWidth
            label="Имя"
            {...register('name', { required: 'Имя обязательно' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            {...register('email', { required: 'Email обязателен' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Пароль"
            type="password"
            {...register('password', { required: 'Пароль обязателен' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Зарегистрироваться</Button>
          <Button fullWidth variant="text" onClick={() => navigate('/login')}>Уже есть аккаунт? Войти</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
