import { Box, CircularProgress, Pagination } from '@mui/material';
import { memo, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMoviesPaginatedThunk } from '../../../store/movies/thunks/fetchPaginatedMoviesThunk';
import MovieList from '../../organisms/MovieList';

const STYLES = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
};

const MoviesPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error, pagination } = useAppSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMoviesPaginatedThunk({ page: 1, limit: 10, withActors: true, withProducers: true }));
  }, [dispatch]);

  const handlePageChange = useCallback(
    (_: unknown, value: number) => {
      dispatch(fetchMoviesPaginatedThunk({ page: value, limit: 10, withActors: true, withProducers: true }));
    },
    [dispatch]
  );

  return (
    <Box sx={STYLES.root}>
      <Box sx={{ minHeight: loading ? '60vh' : 'fit-content' }}>
        {loading.fetch && <CircularProgress size={20} />}

        {error.fetch && !loading.fetch && (
          <Box sx={{ color: 'red' }}>{error.fetch?.message || 'Something went wrong'}</Box>
        )}

        {!loading.fetch && !error.fetch && <MovieList />}
      </Box>

      <Pagination
        size="large"
        count={pagination.totalPages}
        page={pagination.page}
        onChange={handlePageChange}
        variant="outlined"
        shape="rounded"
      />
    </Box>
  );
};

export default memo(MoviesPage);
