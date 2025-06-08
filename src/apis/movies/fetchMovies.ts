import type { Movie } from '../../store/movies/types';
import type { QueryResult } from '../client';
import API_CLIENT from '../client';
import { DEFAULT_SELECTS, TABLES } from '../constants';
import type { ApiPaginatedResponse, ApiResponse } from '../types';
import type { FetchMoviesApiPayload, FetchMoviesPaginatedPayload, Filters } from './types';

export const fetchMovies = async ({
  filters,
  select,
  withActors,
  withProducers,
}: FetchMoviesApiPayload): Promise<ApiResponse<Movie>> => {
  let finalSelect = select || DEFAULT_SELECTS.MOVIES.SELF;
  if (withActors) finalSelect += `,${DEFAULT_SELECTS.MOVIES.WITH_ACTORS}`;
  if (withProducers) finalSelect += `,${DEFAULT_SELECTS.MOVIES.WITH_PRODUCERS}`;

  let query = API_CLIENT.from(TABLES.MOVIES).select(finalSelect);

  query = applyFilters(query, filters);

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return {
    success: true,
    error: null,
    data: data as QueryResult<Movie>,
  };
};

export const fetchMoviesPaginated = async ({
  filters,
  withActors,
  withProducers,
  page = 1,
  limit = 5,
  select,
}: FetchMoviesPaginatedPayload): Promise<ApiPaginatedResponse<Movie>> => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let finalSelect = select || DEFAULT_SELECTS.MOVIES.SELF;
  if (withActors) finalSelect += `,${DEFAULT_SELECTS.MOVIES.WITH_ACTORS}`;
  if (withProducers) finalSelect += `,${DEFAULT_SELECTS.MOVIES.WITH_PRODUCERS}`;

  let query = API_CLIENT.from(TABLES.MOVIES).select(finalSelect, { count: 'exact' });

  query = applyFilters(query, filters);
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    throw error;
  }

  return {
    success: true,
    error: null,
    data: {
      movies: data as QueryResult<Movie>,
      pagination: {
        total: count || 0,
        limit,
        page,
        totalPages: Math.ceil((count || 0) / limit),
      },
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilters(query: any, filters: Filters = {}): any {
  if (filters && Object.keys(filters).length > 0) {
    for (const key in filters) {
      const { op, val } = filters[key];
      if (op === 'ilike') query = query.ilike(key, val as string);
      else query = query.eq(key, val);
    }
  }

  return query;
}
