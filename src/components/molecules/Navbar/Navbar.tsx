import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { memo } from 'react';
import Link from '../../../common/components/Link';
import Logo from '../../../common/components/Logo';
import NavItem from '../../atoms/NavItem';

const PAGES = [
  { label: 'Movies', path: '/' },
  { label: 'Create Movie', path: '/add-movie' },
];

const STYLES = {
  root: {
    backgroundColor: '#000',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navItemContainer: {
    display: 'flex',
    gap: '1rem',
  },
};

const Navbar = () => {
  return (
    <AppBar position="static" elevation={0} sx={STYLES.root}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={STYLES.nav}>
          <Link to="/">
            <Logo />
          </Link>

          <Box sx={STYLES.navItemContainer}>
            {PAGES.map((page) => (
              <NavItem key={page.path} label={page.label} path={page.path} />
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default memo(Navbar);
