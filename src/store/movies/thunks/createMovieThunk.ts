import { createAsyncThunk } from '@reduxjs/toolkit';
import { BUCKETS } from '../../../apis/constants';
import { uploadFile } from '../../../apis/fileUpload/fileUpload';
import { createMovieActors } from '../../../apis/movieActors/createMovieActors';
import { createMovie, type CreateMovieApiPayload } from '../../../apis/movies/createMovie';

export interface CreateMovieThunkPayload extends CreateMovieApiPayload {
  posterFile: File | null;
  actor_ids: number[];
}

export const createMovieThunk = createAsyncThunk(
  'movies/createMovie',
  async (payload: CreateMovieThunkPayload, { rejectWithValue }) => {
    try {
      const { posterFile, actor_ids, ...createMoviePayload } = payload;

      let posterUrl = '';

      if (posterFile) {
        const uploadResult = await uploadFile({ file: posterFile, bucket: BUCKETS.POSTERS });
        posterUrl = uploadResult.path || '';
      }

      const { data: newMovie } = await createMovie({ ...createMoviePayload, poster: posterUrl });

      if (newMovie && actor_ids?.length > 0) {
        const actorMoviesData = actor_ids.map((aid: number) => ({
          actor_id: aid,
          movie_id: newMovie.id,
        }));

        await createMovieActors(actorMoviesData);
      }

      return newMovie;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
