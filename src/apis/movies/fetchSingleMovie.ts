import type { Movie } from '../../store/movies/types';
import API_CLIENT, { type QueryResult } from '../client';
import { DEFAULT_SELECTS, TABLES } from '../constants';
import type { ApiSingleResponse } from '../types';

interface FetchSingleMoviePayload {
  id: number;
  withActors?: boolean;
  withProducers?: boolean;
  select?: string;
}

export const fetchSingleMovie = async ({
  id,
  withActors = false,
  withProducers = false,
  select,
}: FetchSingleMoviePayload): Promise<ApiSingleResponse<Movie>> => {
  let finalSelect = select || DEFAULT_SELECTS.MOVIES.SELF;
  if (withActors) finalSelect += `,${DEFAULT_SELECTS.MOVIES.WITH_ACTORS}`;
  if (withProducers) finalSelect += `,${DEFAULT_SELECTS.MOVIES.WITH_PRODUCERS}`;

  const { data: movie, error } = await API_CLIENT.from(TABLES.MOVIES).select(finalSelect).eq('id', id).single();

  if (error) {
    throw error;
  }

  return {
    success: true,
    data: movie as QueryResult<Movie>,
    error: null,
  };
};
