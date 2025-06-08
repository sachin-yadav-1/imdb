import type { MoviesInitialState } from './types';

export const moviesInitialState: MoviesInitialState = {
  entities: {},
  ids: [],
  loading: {
    fetch: false,
    fetchSingle: false,
    create: false,
    update: false,
  },
  error: {
    fetch: null,
    fetchSingle: null,
    create: null,
    update: null,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};
