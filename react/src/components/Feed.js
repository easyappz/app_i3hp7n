import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instance } from '../api/axios';
import { Box, Card, CardContent, Typography, InputBase, Button, Avatar, Divider, CircularProgress, IconButton } from '@mui/material';
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
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              {currentUser.username[0].toUpperCase()}
            </Avatar>
            <InputBase
              sx={{ flex: 1, bgcolor: '#f0f2f5', p: 1.5, borderRadius: 4, minHeight: 40 }}
              multiline
              placeholder={`Что у вас нового, ${currentUser.username}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Box>
          <Button variant="contained" fullWidth onClick={handleSubmit} disabled={mutation.isPending} sx={{ mt: 2 }}>
            Опубликовать
          </Button>
        </CardContent>
      </Card>
      {posts.map((post) => (
        <Card key={post._id} sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                {post.userId.username[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">{post.userId.username}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatRelative(new Date(post.createdAt), new Date(), { locale: ru })}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>{post.content}</Typography>
            <Divider sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton><ThumbUpIcon /></IconButton>
                <Typography variant="body2">Нравится</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton><CommentIcon /></IconButton>
                <Typography variant="body2">Комментировать</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton><ShareIcon /></IconButton>
                <Typography variant="body2">Поделиться</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Feed;
