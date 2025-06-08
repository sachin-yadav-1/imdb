import type { Movie } from '../../store/movies/types';
import API_CLIENT, { type QueryResult } from '../client';
import { TABLES } from '../constants';
import type { ApiSingleResponse } from '../types';

export interface UpdateMovieApiPayload {
  name?: string;
  plot?: string;
  release_date?: string;
  poster?: string;
  producer_id?: number;
}

export const updateMovie = async (id: number, data: UpdateMovieApiPayload): Promise<ApiSingleResponse<Movie>> => {
  const { data: updatedMovie, error } = await API_CLIENT.from(TABLES.MOVIES)
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    success: true,
    data: updatedMovie as QueryResult<Movie>,
    error: null,
  };
};
