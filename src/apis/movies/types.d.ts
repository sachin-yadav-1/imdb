import type { Filters } from '../types';

export interface FetchMoviesApiPayload {
  filters?: Filters;
  select?: string;
  withActors?: boolean;
  withProducers?: boolean;
  withCount?: boolean;
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface FetchMoviesPaginatedPayload {
  filters?: Filters;
  withActors?: boolean;
  withProducers?: boolean;
  page?: number;
  limit?: number;
  select?: string;
}
