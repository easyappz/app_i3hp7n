import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Profile from './components/Profile';
import Search from './pages/Search';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import AuthGuard from './components/AuthGuard';
import ProtectedLayout from './components/ProtectedLayout';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<AuthGuard><Home /></AuthGuard>} />
          <Route element={<AuthGuard><ProtectedLayout /></AuthGuard>}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:userId" element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
