import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSingleMovie } from '../../../apis/movies/fetchSingleMovie';
import { updateActorsFromMovie } from '../../actors/slices';
import type { MovieWithActorsAndProducers } from '../types';

interface FetchSingleMoviePayload {
  id: number;
  withActors?: boolean;
  withProducers?: boolean;
}

export const fetchSingleMovieThunk = createAsyncThunk(
  'movies/fetchSingleMovie',
  async ({ id, withActors = true, withProducers = true }: FetchSingleMoviePayload, { rejectWithValue, dispatch }) => {
    try {
      const {
        data: movie,
        success,
        error,
      } = await fetchSingleMovie({
        id,
        withActors,
        withProducers,
      });

      if (!success || error || !movie) {
        return rejectWithValue(error || 'Failed to fetch movie');
      }

      const movieData = movie as MovieWithActorsAndProducers;

      const actorsMap = new Map();
      const actorIds: number[] = [];

      if (movieData.actor_movie) {
        movieData.actor_movie.forEach((am) => {
          if (am.actors && !actorsMap.has(am.actors.id)) {
            actorsMap.set(am.actors.id, am.actors);
            actorIds.push(am.actors.id);
          }
        });
      }

      if (movieData.producer_id) {
        movieData.producer = movieData.producer_id;
        delete movieData.producer_id;
      }

      movieData.actor_ids = actorIds;
      delete movieData.actor_movie;

      if (actorsMap.size > 0) {
        dispatch(updateActorsFromMovie(Array.from(actorsMap.values())));
      }

      return movieData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
