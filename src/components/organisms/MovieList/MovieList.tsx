import { Box, Typography } from '@mui/material';
import { memo } from 'react';
import { useAppSelector } from '../../../store/hooks';
import MovieCard from '../MovieCard';

const STYLES = {
  root: {
    border: '1px solid #ddd',
    width: '100%',
    minHeight: '60vh',
    padding: '1rem',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: '1.6rem',
    fontWeight: 600,
  },
};

const MovieList = () => {
  const { entities: movies, ids } = useAppSelector((state) => state.movies);

  return (
    <Box sx={STYLES.root}>
      {ids?.length === 0 && <Typography sx={STYLES.text}>No movies found. Please create one.</Typography>}
      {ids && ids?.map((id, idx) => <MovieCard key={id} movie={movies[id]} borderless={idx === ids.length - 1} />)}
    </Box>
  );
};

export default memo(MovieList);
