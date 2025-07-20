import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Badge, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';

const facebookBlue = '#1877F2';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f0f2f5',
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: facebookBlue }}>
      <Toolbar>
        <Typography variant="h6" noWrap component={Link} to="/" sx={{ color: 'white', textDecoration: 'none' }}>
          СоцСеть
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Поиск..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        <div style={{ flexGrow: 1 }} />
        <IconButton component={Link} to="/feed" color="inherit">
          <HomeIcon />
        </IconButton>
        <IconButton component={Link} to="/search" color="inherit">
          <PeopleIcon />
        </IconButton>
        <IconButton component={Link} to="/messages" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MessageIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit">
          <Badge badgeContent={17} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton component={Link} to="/profile/me" edge="end" color="inherit">
          <Avatar sx={{ width: 32, height: 32 }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
