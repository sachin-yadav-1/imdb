import MovieIcon from '@mui/icons-material/Movie';
import { Box, Typography } from '@mui/material';

const STYLES = {
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logoIcon: {
    color: '#fff',
    fontSize: '2rem',
    marginRight: '1rem',
  },
  logoText: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '.3rem',
  },
};

const Logo = () => {
  return (
    <Box sx={STYLES.root}>
      <MovieIcon sx={STYLES.logoIcon} />
      <Typography variant="h6" sx={STYLES.logoText}>
        IMDb.com
      </Typography>
    </Box>
  );
};

export default Logo;
