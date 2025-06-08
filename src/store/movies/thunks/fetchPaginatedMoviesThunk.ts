import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMoviesPaginated } from '../../../apis/movies/fetchMovies';
import type { FetchMoviesPaginatedPayload } from '../../../apis/movies/types';
import { updateActorsFromMovie } from '../../actors/slices';
import type { MovieWithActorsAndProducers } from '../types';

export const fetchMoviesPaginatedThunk = createAsyncThunk(
  'movies/fetchPaginatedMovies',
  async (payload: FetchMoviesPaginatedPayload, { rejectWithValue, dispatch }) => {
    try {
      const { data, success, error } = await fetchMoviesPaginated(payload);

      if (!success || error) {
        return rejectWithValue(error || 'Failed to fetch movies');
      }

      const { movies, pagination } = data;

      const actorsMap = new Map();
      movies.forEach((movie: MovieWithActorsAndProducers) => {
        const actorIds: number[] = [];

        movie.actor_movie?.forEach((am) => {
          if (am.actors && !actorsMap.has(am.actors.id)) {
            actorsMap.set(am.actors.id, am.actors);
            actorIds.push(am.actors.id);
          }
        });

        if (movie.producer_id) {
          movie.producer = movie.producer_id;
          delete movie.producer_id;
        }

        movie.actor_ids = actorIds;
        delete movie.actor_movie;
      });

      if (actorsMap.size > 0) {
        dispatch(updateActorsFromMovie(Array.from(actorsMap.values())));
      }

      return { movies, pagination };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
