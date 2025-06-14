import { memo, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import useNavigation from '../../../common/hooks/useNavigation';
import { useAppDispatch } from '../../../store/hooks';
import { initializeEditMovieForm } from '../../../store/movies/slices';
import { fetchSingleMovieThunk } from '../../../store/movies/thunks/fetchSingleMovieThunk';
import type { RootState } from '../../../store/types';
import PageTitle from '../../atoms/PageTitle';
import EditMovieForm from '../../organisms/EditMovieForm';

const DEFAULT_OBJ: any = {};
const EditMoviePage = () => {
  const dispatch = useAppDispatch();
  const { path } = useNavigation();
  const movies = useSelector((state: RootState) => state.movies.entities) || DEFAULT_OBJ;
  const actors = useSelector((state: RootState) => state.actors.entities) || DEFAULT_OBJ;

  const movieId = useMemo(() => {
    const pathParts = path.split('/');
    const idString = pathParts[pathParts.length - 1];
    return parseInt(idString, 10);
  }, [path]);

  const movie = useMemo(() => {
    return movies[movieId];
  }, [movies, movieId]);

  useEffect(() => {
    if (movieId && !movie) {
      dispatch(fetchSingleMovieThunk({ id: movieId, withActors: true, withProducers: true }));
    }
  }, [movieId]);

  useEffect(() => {
    if (movie) {
      const editMovieState = {
        name: {
          value: movie?.name || '',
          error: '',
        },
        release_date: {
          value: movie?.release_date || '',
          error: '',
        },
        producer: {
          value: (movie?.producer_id as number) || (movie?.producer?.id as number) || '',
          selected: movie?.producer || {},
          error: '',
        },
        plot: {
          value: movie?.plot || '',
          error: '',
        },
        actors: {
          value: '',
          selected: movie?.actor_ids?.map((aid) => actors[aid]) || [],
          error: '',
        },
        poster: {
          value: '',
          error: '',
        },
      };

      dispatch(initializeEditMovieForm({ movie: editMovieState }));
    }
  }, [movie]);

  return (
    <>
      <PageTitle title="Edit Movie" />
      <EditMovieForm movieId={movieId || null} />
    </>
  );
};

export default memo(EditMoviePage);
