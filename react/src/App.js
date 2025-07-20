import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Search from './components/Search';
import Messages from './components/Messages';
import Chat from './components/Chat';
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
          <Route element={<AuthGuard><ProtectedLayout /></AuthGuard>}>
            <Route index element={<Feed />} />
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
