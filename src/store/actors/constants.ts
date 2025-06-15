import type { CreatePersonFormState } from '../../common/types';
import type { ActorsInitialState } from './types';

export const personFormInitialState: CreatePersonFormState = {
  name: {
    value: '',
    error: '',
  },
  dob: {
    value: '',
    error: '',
  },
  gender: {
    value: '',
    error: '',
  },
  bio: {
    value: '',
    error: '',
  },
};

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
  createForm: personFormInitialState,
};
