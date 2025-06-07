import type { ActorsInitialState } from './types';

export const actorsInitialState: ActorsInitialState = {
  entities: {},
  ids: [],
  searchResults: [],
  loading: {
    create: false,
    search: false,
  },
  error: {
    create: null,
    search: null,
  },
};
