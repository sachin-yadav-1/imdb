import type { CreatePersonFormState, Validate } from '../../common/types';
import type { ProducersInitialState } from './types';

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
  createForm: personFormInitialState,
};
