import type { Movie } from '../../store/movies/types';
import type { QueryResult } from '../client';
import API_CLIENT from '../client';
import { TABLES } from '../constants';

import type { ApiSingleResponse } from '../types';

export interface CreateMovieApiPayload {
  name: string;
  plot: string;
  release_date: string;
  poster: string;
  producer_id: number;
}
export const createMovie = async (data: CreateMovieApiPayload): Promise<ApiSingleResponse<Movie>> => {
  const { data: newMovie, error } = await API_CLIENT.from(TABLES.MOVIES).insert([data]).select().single();

  if (error) {
    throw error;
  }

  return {
    success: true,
    data: newMovie as QueryResult<Movie>,
    error: null,
  };
};
