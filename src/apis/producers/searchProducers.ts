import type { Producer } from '../../store/producers/types';
import API_CLIENT, { type QueryResult } from '../client';
import { TABLES } from '../constants';
import { applyFilters } from '../helpers';
import type { ApiResponse, Filters } from '../types';

interface GetProducersApiPayload {
  filters?: Filters;
  select?: string;
}
export const searchProducers = async ({ filters, select }: GetProducersApiPayload): Promise<ApiResponse<Producer>> => {
  let query = API_CLIENT.from(TABLES.PRODUCERS).select(select || '*');
  query = applyFilters(query, filters);

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return {
    success: true,
    error: null,
    data: data as QueryResult<Producer>,
  };
};
