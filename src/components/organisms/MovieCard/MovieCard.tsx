import { Box, Card, CardContent, CardMedia, Typography, type SxProps } from '@mui/material';
import { memo, useMemo } from 'react';
import { getYearFromDate } from '../../../common/utils/date';
import type { Movie } from '../../../store/movies/types';
import MoviePlot from '../../molecules/MoviePlot';
import MovieActions from '../../molecules/MovieActions';
import MovieCastDetails from '../../molecules/MovieCastDetails';

interface MovieCardProps {
  movie: Movie;
  borderless?: boolean;
  styles?: {
    root?: SxProps;
    card?: SxProps;
    media?: SxProps;
    title?: SxProps;
    plot?: SxProps;
    key?: SxProps;
    value?: SxProps;
  };
}

const STYLES = {
  root: {
    paddingBottom: '1rem',
    borderBottom: '1px solid #ddd',
  },
  card: {
    display: 'flex',
    gap: '1rem',
  },
  media: {
    width: '120px',
    height: '180px',
    borderRadius: '4px',
  },
  content: {
    width: '100%',
    gap: '1.4rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 500,
  },
  plot: {
    fontSize: '1.4rem',
    fontWeight: 400,
  },
  key: {
    fontSize: '1.4rem',
    fontWeight: 500,
  },
  value: {
    fontSize: '1.4rem',
    fontWeight: 400,
  },
};

export const MovieCard: React.FC<MovieCardProps> = ({ movie, styles, borderless }) => {
  const rootStyles = useMemo(
    () => ({ ...STYLES.root, ...styles?.root, ...(borderless ? { border: 'none', paddingBottom: 0 } : {}) }),
    [styles, borderless]
  );

  return (
    <Box sx={rootStyles}>
      <Card sx={STYLES.card} elevation={0}>
        <CardMedia sx={STYLES.media} component="img" alt={`Poster for ${movie.name}`} image={movie.poster} />

        <CardContent sx={STYLES.content}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography gutterBottom variant="h5" component="div" sx={STYLES.title}>
              {movie.name}
            </Typography>
            <Typography variant="body2" sx={STYLES.key}>
              {getYearFromDate(movie.release_date)}
            </Typography>
          </Box>

          <MoviePlot plot={movie.plot} />

          <MovieCastDetails movie={movie} maxVisible={3} />
        </CardContent>

        <MovieActions movieId={movie.id} />
      </Card>
    </Box>
  );
};

export default memo(MovieCard);
