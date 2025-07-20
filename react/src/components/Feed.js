import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instance } from '../api/axios';
import { Box, Card, CardContent, Typography, InputBase, Button, Avatar, Divider, CircularProgress, IconButton, Paper } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import formatRelative from 'date-fns/formatRelative';
import ru from 'date-fns/locale/ru';

const fetchPosts = async () => {
  const response = await instance.get('/api/posts');
  return response.data;
};

const fetchCurrentUser = async () => {
  const response = await instance.get('/api/users/me');
  return response.data;
};

const createPost = async (newPost) => {
  const response = await instance.post('/api/posts', newPost);
  return response.data;
};

const Feed = () => {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
  const { data: currentUser, isLoading: userLoading, error: userError } = useQuery({ queryKey: ['currentUser'], queryFn: fetchCurrentUser });

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

  if (postsLoading || userLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (postsError || userError) return <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>Ошибка загрузки данных</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Создать публикацию</Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
              {currentUser.username[0].toUpperCase()}
            </Avatar>
            <InputBase
              sx={{ flex: 1, bgcolor: '#f0f2f5', p: 1.5, borderRadius: 4, minHeight: 50, fontSize: '1.1rem' }}
              multiline
              placeholder={`Что у вас нового, ${currentUser.username}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Button variant="contained" fullWidth onClick={handleSubmit} disabled={mutation.isPending} sx={{ borderRadius: 20, textTransform: 'none' }}>
            Опубликовать
          </Button>
        </CardContent>
      </Paper>
      {posts.map((post) => (
        <Paper key={post._id} elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
                {post.userId.username[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{post.userId.username}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatRelative(new Date(post.createdAt), new Date(), { locale: ru })}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1rem' }}>{post.content}</Typography>
            <Divider sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 1 }}>
              <IconButton color="primary"><ThumbUpIcon /></IconButton>
              <IconButton color="primary"><CommentIcon /></IconButton>
              <IconButton color="primary"><ShareIcon /></IconButton>
            </Box>
          </CardContent>
        </Paper>
      ))}
    </Box>
  );
};

export default Feed;
