import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { memo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { logoutThunk } from '../../../store/auth/thunks/logoutThunk';
import { useAppDispatch } from '../../../store/hooks';
import type { RootState } from '../../../store/types';

const STYLES = {
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: 'secondary.dark',
    fontSize: '1.4rem',
  },
  menu: {
    mt: '45px',
  },
  menuItem: {
    padding: '1rem 1.5rem',
    minWidth: '200px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  userName: {
    fontSize: '1.4rem',
    fontWeight: 600,
  },
  userEmail: {
    fontSize: '1.2rem',
    color: 'text.secondary',
  },
  menuButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    width: '100%',
    justifyContent: 'flex-start',
    fontSize: '1.4rem',
  },
};

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(async () => {
    handleClose();
    await dispatch(logoutThunk());
  }, [dispatch, handleClose]);

  if (!user) {
    return null;
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials = getInitials(user.firstName || '', user.lastName || '');

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <Avatar sx={STYLES.avatar}>{initials}</Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        sx={STYLES.menu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={STYLES.menuItem} onClick={(e) => e.stopPropagation()}>
          <Box sx={STYLES.userInfo}>
            <Typography sx={STYLES.userName}>{fullName || 'User'}</Typography>
            <Typography sx={STYLES.userEmail}>{user.email}</Typography>
          </Box>
        </MenuItem>

        <Divider />

        <MenuItem sx={STYLES.menuItem} onClick={handleLogout} disabled={loading.logout}>
          <Box sx={STYLES.menuButton}>
            <LogoutIcon fontSize="small" />
            <Typography>{loading.logout ? 'Logging out...' : 'Logout'}</Typography>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export default memo(UserProfile);
