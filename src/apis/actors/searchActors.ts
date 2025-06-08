import type { Actor } from '../../store/actors/types';
import API_CLIENT, { type QueryResult } from '../client';
import { TABLES } from '../constants';
import { applyFilters } from '../helpers';
import type { ApiResponse, Filters } from '../types';

interface SearchActorsApiPayload {
  filters?: Filters;
  select?: string;
}

export const searchActors = async ({ filters, select }: SearchActorsApiPayload): Promise<ApiResponse<Actor>> => {
  let query = API_CLIENT.from(TABLES.ACTORS).select(select || '*');
  query = applyFilters(query, filters);

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return {
    success: true,
    error: null,
    data: data as QueryResult<Actor>,
  };
};
