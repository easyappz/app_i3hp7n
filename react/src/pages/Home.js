import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Card, CardContent, TextField, Button } from '@mui/material';
import { instance } from '../api/axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handlePost = async () => {
    try {
      const response = await instance.post('/posts', { content: newPost });
      setPosts([response.data, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Лента новостей</Typography>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Что у вас нового?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <Button variant="contained" onClick={handlePost} sx={{ mt: 1 }}>Опубликовать</Button>
        </Box>
        {posts.map((post) => (
          <Card key={post._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body1">{post.content}</Typography>
              <Typography variant="caption" color="text.secondary">{new Date(post.createdAt).toLocaleString('ru-RU')}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Home;
