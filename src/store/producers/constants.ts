import type { PersonFormState } from '../actors/types';
import type { ProducersInitialState } from './types';

export const personFormInitialState: PersonFormState = {
  data: {
    name: '',
    bio: '',
    dob: '',
    gender: '',
  },
  errors: {},
  touched: {
    name: false,
    bio: false,
    dob: false,
    gender: false,
  },
  isValid: false,
  isDirty: false,
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
