import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instance } from '../api/axios';
import { Box, Card, CardContent, Typography, TextField, Button, Avatar, Divider, CircularProgress } from '@mui/material';

const fetchPosts = async () => {
  const response = await instance.get('/api/posts');
  return response.data;
};

const createPost = async (newPost) => {
  const response = await instance.post('/api/posts', newPost);
  return response.data;
};

const Feed = () => {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const { data: posts, isLoading, error } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      setContent('');
    },
  });

  const handleSubmit = () => {
    if (content.trim()) {
      mutation.mutate({ content });
    }
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Ошибка загрузки постов</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Создать пост</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Что у вас нового?"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSubmit} disabled={mutation.isPending}>
            Опубликовать
          </Button>
        </CardContent>
      </Card>
      {posts.map((post) => (
        <Card key={post._id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ mr: 2 }} />
              <Box>
                <Typography variant="subtitle1">{post.userId.username}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(post.createdAt).toLocaleString('ru-RU')}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <Typography>{post.content}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Feed;
