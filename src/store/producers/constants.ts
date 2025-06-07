import type { ProducersInitialState } from './types';

export const producersInitialState: ProducersInitialState = {
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
