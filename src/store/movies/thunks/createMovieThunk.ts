import { createAsyncThunk } from '@reduxjs/toolkit';
import { createMovieActors } from '../../../apis/movieActors/createMovieActors';
import { createMovie, type CreateMovieApiPayload } from '../../../apis/movies/createMovie';
import { setToast } from '../../common/slices';
import { uploadFile } from '../../../apis/fileUpload/fileUpload';
import { BUCKETS } from '../../../apis/constants';

export interface CreateMovieThunkPayload extends CreateMovieApiPayload {
  actor_ids: number[];
}

export const createMovieThunk = createAsyncThunk(
  'movies/createMovie',
  async (payload: CreateMovieThunkPayload, { rejectWithValue, dispatch }) => {
    try {
      const { poster, actor_ids, ...createMoviePayload } = payload;

      let posterUrl = '';
      if (poster && (poster as any) instanceof File) {
        const uploadResult = await uploadFile({
          file: poster as any,
          bucket: BUCKETS.POSTERS,
        });

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

      dispatch(
        setToast({
          show: true,
          message: 'Movie created successfully',
          duration: 3000,
          type: 'success',
        })
      );

      return newMovie;
    } catch (err) {
      dispatch(
        setToast({
          show: true,
          message: 'Error creating movie',
          duration: 3000,
          type: 'error',
        })
      );

      return rejectWithValue(err);
    }
  }
);
