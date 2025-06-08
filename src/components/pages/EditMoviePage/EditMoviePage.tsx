import { Box, CircularProgress, Typography } from '@mui/material';
import { memo, useEffect, useMemo } from 'react';
import useNavigation from '../../../common/hooks/useNavigation';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchSingleMovieThunk } from '../../../store/movies/thunks/fetchSingleMovieThunk';
import PageTitle from '../../atoms/PageTitle';
import MovieForm from '../../organisms/MovieForm';

const EditMoviePage = () => {
  const { navigate, path } = useNavigation();
  const dispatch = useAppDispatch();

  const movieId = useMemo(() => {
    const pathParts = path.split('/');
    const idString = pathParts[pathParts.length - 1];
    return parseInt(idString, 10);
  }, [path]);

  const { movie, loading, error } = useAppSelector((state) => ({
    movie: movieId ? state.movies.entities[movieId] : null,
    loading: state.movies.loading.fetchSingle,
    error: state.movies.error.fetchSingle,
  }));

  useEffect(() => {
    if (movieId && !isNaN(movieId)) {
      dispatch(
        fetchSingleMovieThunk({
          id: movieId,
          withActors: true,
          withProducers: true,
        })
      );
    }
  }, [dispatch, movieId]);

  const handleSuccess = () => {
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (isNaN(movieId)) {
    return (
      <Box sx={{ padding: '2rem', textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Invalid movie ID
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: '2rem', textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Error loading movie: {error.message || 'Unknown error'}
        </Typography>
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box sx={{ padding: '2rem', textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Movie not found
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <PageTitle title={`Edit Movie: ${movie.name}`} />
      <MovieForm
        key={`edit-movie-form-${movieId}`}
        mode="edit"
        movieId={movieId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </>
  );
};

export default memo(EditMoviePage);
