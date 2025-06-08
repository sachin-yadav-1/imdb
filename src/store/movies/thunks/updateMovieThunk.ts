import { createAsyncThunk } from '@reduxjs/toolkit';
import { BUCKETS } from '../../../apis/constants';
import { uploadFile } from '../../../apis/fileUpload/fileUpload';
import { updateMovie, type UpdateMovieApiPayload } from '../../../apis/movies/updateMovie';
import { createMovieActors } from '../../../apis/movieActors/createMovieActors';
import { setToast } from '../../common/slices';
import { deleteMovieActors } from '../../../apis/movieActors/deleteMovieActors';

export interface UpdateMovieThunkPayload extends Omit<UpdateMovieApiPayload, 'id'> {
  posterFile: File | null;
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
      const { posterFile, actor_ids, ...updateMoviePayload } = payload;

      let posterUrl = updateMoviePayload.poster;

      if (posterFile) {
        const uploadResult = await uploadFile({ file: posterFile, bucket: BUCKETS.POSTERS });
        posterUrl = uploadResult.path || '';
      }

      const { data: updatedMovie } = await updateMovie(id, {
        ...updateMoviePayload,
        poster: posterUrl,
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
