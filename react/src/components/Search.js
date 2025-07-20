import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { instance } from '../api/axios';
import { Box, TextField, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, CircularProgress, Paper, Divider } from '@mui/material';

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
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Поиск пользователей</Typography>
      <TextField
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Введите имя или email"
        variant="outlined"
        sx={{ mb: 3, borderRadius: 2, backgroundColor: '#f0f2f5' }}
      />
      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}
      {error && <Typography color="error" sx={{ textAlign: 'center' }}>Ошибка поиска</Typography>}
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <List disablePadding>
          {(users || []).map((user, index) => (
            <React.Fragment key={user._id}>
              <ListItem button component="a" href={`/profile/${user._id}`} sx={{ py: 2 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50, mr: 2 }}>
                    {user.username[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{user.username}</Typography>} 
                  secondary={<Typography variant="body2" color="text.secondary">{user.email}</Typography>} 
                />
              </ListItem>
              {index < users.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Search;
