import { memo, useEffect, useMemo } from 'react';
import useNavigation from '../../../common/hooks/useNavigation';
import PageTitle from '../../atoms/PageTitle';
import EditMovieForm from '../../organisms/EditMovieForm';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/types';
import { useAppDispatch } from '../../../store/hooks';
import { initializeEditMovieForm } from '../../../store/movies/slices';

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

  useEffect(() => {
    const movie = movies[movieId];

    if (movie) {
      const editMovieState = {
        name: {
          value: movie.name || '',
          error: '',
        },
        release_date: {
          value: movie.release_date || '',
          error: '',
        },
        producer: {
          value: (movie.producer!.id as number) || '',
          selected: movie.producer || {},
          error: '',
        },
        plot: {
          value: movie.plot || '',
          error: '',
        },
        actors: {
          value: '',
          selected: movie.actor_ids?.map((aid) => actors[aid]) || [],
          error: '',
        },
        poster: {
          value: '',
          error: '',
        },
      };

      dispatch(initializeEditMovieForm({ movie: editMovieState }));
    }
  }, [movieId]);

  return (
    <>
      <PageTitle title="Edit Movie" />
      <EditMovieForm />
    </>
  );
};

export default memo(EditMoviePage);
