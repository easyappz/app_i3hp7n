import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Container } from '@mui/material';

const ProtectedLayout = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default ProtectedLayout;
