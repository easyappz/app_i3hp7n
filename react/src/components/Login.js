import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
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
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FacebookIcon sx={{ fontSize: 60, color: '#1877f2', mb: 2 }} />
          <Typography component="h1" variant="h5" color="text.primary" gutterBottom>
            Вход в аккаунт
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
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
              Войти
            </Button>
            <Link href="#" variant="body2" sx={{ display: 'block', textAlign: 'center', mb: 2 }}>
              Забыли пароль?
            </Link>
            <Button fullWidth variant="outlined" onClick={() => navigate('/register')} sx={{ mt: 1, borderColor: '#1877f2', color: '#1877f2', borderRadius: 2 }}>
              Создать новый аккаунт
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
