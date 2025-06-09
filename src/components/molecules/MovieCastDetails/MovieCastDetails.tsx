import { Box, Typography } from '@mui/material';
import { memo, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { Actor } from '../../../store/actors/types';
import type { Movie } from '../../../store/movies/types';
import type { Producer } from '../../../store/producers/types';
import type { RootState } from '../../../store/types';

interface MovieCastDetailsProps {
  movie: Movie;
  maxVisible?: number;
}

const STYLES = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  castContainer: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  key: {
    fontSize: '1.4rem',
    fontWeight: 500,
  },
  value: {
    fontSize: '1.4rem',
    fontWeight: 400,
  },
  showMore: {
    padding: 0,
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 400,
    textTransform: 'none',
    marginLeft: '3px',
    color: 'primary.main',
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },
};

const getCastToShow = (cast: Actor[] | Producer[], maxVisible: number, showAll: boolean) => {
  if (cast.length <= maxVisible || showAll) {
    return cast.map((item) => item.name).join(', ');
  }

  return cast
    .slice(0, maxVisible)
    .map((item) => item.name)
    .join(', ');
};

const MovieCastDetails: React.FC<MovieCastDetailsProps> = ({ movie, maxVisible = 3 }) => {
  const { entities: actors } = useSelector((state: RootState) => state.actors);
  const [showAll, setShowAll] = useState(false);

  const finalActors = useMemo(() => {
    return getCastToShow(movie.actor_ids?.map((id) => actors[id] || []) || [], maxVisible, showAll);
  }, [movie.actor_ids, actors, maxVisible, showAll]);

  const handleShowMore = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  return (
    <Box sx={STYLES.root}>
      <Box sx={STYLES.castContainer}>
        <Typography variant="body2" sx={STYLES.key}>
          Producer:
        </Typography>
        <Typography variant="body2" sx={STYLES.value}>
          {movie.producer?.name}
        </Typography>
      </Box>
      <Box sx={STYLES.castContainer}>
        <Typography variant="body2" sx={STYLES.key}>
          Actors:
        </Typography>

        <Typography variant="body2" sx={STYLES.value}>
          {finalActors || '--'}
        </Typography>

        {movie.actor_ids?.length > maxVisible && (
          <Typography component="span" onClick={handleShowMore} sx={STYLES.showMore}>
            {showAll ? 'Show less' : 'Show more'}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default memo(MovieCastDetails);
