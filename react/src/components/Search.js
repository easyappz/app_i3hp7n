import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { instance } from '../api/axios';
import { Box, TextField, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, CircularProgress } from '@mui/material';

const searchUsers = async (query) => {
  const response = await instance.get(`/api/users/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

const Search = () => {
  const [query, setQuery] = useState('');
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchUsers(query),
    enabled: !!query,
  });

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Поиск пользователей</Typography>
      <TextField
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Введите имя или email"
        sx={{ mb: 2 }}
      />
      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}
      {error && <Typography color="error" sx={{ textAlign: 'center' }}>Ошибка поиска</Typography>}
      <List>
        {(users || []).map((user) => (
          <ListItem key={user._id} button component="a" href={`/profile/${user._id}`}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {user.username[0].toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.username} secondary={user.email} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Search;
