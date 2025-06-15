import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import Link from '../../../common/components/Link';
import Logo from '../../../common/components/Logo';
import type { RootState } from '../../../store/types';
import NavItem from '../../atoms/NavItem';
import UserProfile from '../../organisms/UserProfile';

const STYLES = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navItemContainer: {
    display: 'flex',
    gap: '1rem',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
};

const Navbar = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={STYLES.nav}>
          <Link to="/">
            <Logo />
          </Link>

          <Box sx={STYLES.rightSection}>
            <Box sx={STYLES.navItemContainer}>
              <NavItem key="movies" label="Movies" path="/" />
              {isAuthenticated && <NavItem key="create-movie" label="Create New Movie" path="/add-movie" />}
              {isAuthenticated && <UserProfile />}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default memo(Navbar);
