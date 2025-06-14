import { createAsyncThunk } from '@reduxjs/toolkit';
import { createMovieActors } from '../../../apis/movieActors/createMovieActors';
import { deleteMovieActors } from '../../../apis/movieActors/deleteMovieActors';
import { updateMovie, type UpdateMovieApiPayload } from '../../../apis/movies/updateMovie';
import { setToast } from '../../common/slices';

export interface UpdateMovieThunkPayload extends Omit<UpdateMovieApiPayload, 'id' | 'poster'> {
  poster: File | null;
  actor_ids: number[];
}

interface UpdateMovieThunkParams {
  id: number;
  data: UpdateMovieThunkPayload;
}

export const updateMovieThunk = createAsyncThunk(
  'movies/updateMovie',
  async ({ id, data: payload }: UpdateMovieThunkParams, { rejectWithValue, dispatch }) => {
    try {
      const { poster, actor_ids, ...updateMoviePayload } = payload;

      // let posterUrl = updateMoviePayload.poster;

      // if (posterFile) {
      //   const uploadResult = await uploadFile({ file: posterFile, bucket: BUCKETS.POSTERS });
      //   posterUrl = uploadResult.path || '';
      // }

      const { data: updatedMovie } = await updateMovie(id, {
        ...updateMoviePayload,
        poster: '',
      });

      if (updatedMovie && actor_ids?.length >= 0) {
        await deleteMovieActors(id);

        if (actor_ids.length > 0) {
          const actorMoviesData = actor_ids.map((aid: number) => ({
            actor_id: aid,
            movie_id: id,
          }));

          await createMovieActors(actorMoviesData);
        }
      }

      dispatch(
        setToast({
          show: true,
          message: 'Movie updated successfully',
          duration: 3000,
          type: 'success',
        })
      );

      return { ...updatedMovie, actor_ids };
    } catch (err) {
      dispatch(
        setToast({
          show: true,
          message: 'Error updating movie',
          duration: 3000,
          type: 'error',
        })
      );
      return rejectWithValue(err);
    }
  }
);
