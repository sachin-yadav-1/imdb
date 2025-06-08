import API_CLIENT from '../client';
import { TABLES } from '../constants';
import type { ApiResponse } from '../types';

export const deleteMovieActors = async (movieId: number): Promise<ApiResponse<any>> => {
  const { data, error } = await API_CLIENT.from(TABLES.ACTOR_MOVIE).delete().eq('movie_id', movieId);

  if (error) {
    throw error;
  }

  return {
    success: true,
    data: data,
    error: null,
  };
};
