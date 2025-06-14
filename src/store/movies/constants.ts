import type { MovieFormState, MoviesInitialState, Validate } from './types';

export const movieFormInitialState: MovieFormState = {
  name: {
    value: '',
    error: '',
  },
  plot: {
    value: '',
    error: '',
  },
  producer: {
    value: '',
    error: '',
    selected: {},
  },
  actors: {
    value: '',
    error: '',
    selected: [] as any[],
  },
  release_date: {
    value: '',
    error: '',
  },
  poster: {
    value: '',
    error: '',
  },
};

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
  createForm: movieFormInitialState,
  editForm: movieFormInitialState,
};

export const FORM_FIELD_VALIDATIONS: Record<keyof MovieFormState, Validate> = {
  name: {
    validate: (name: MovieFormState['name']) => {
      if (!String(name.value)?.trim()) {
        return { valid: false, error: 'Name is rquired' };
      }
      return { valid: true, error: '' };
    },
  },
  plot: {
    validate: (plot: MovieFormState['plot']) => {
      if (!String(plot.value).trim()) {
        return { valid: false, error: 'Plot is rquired' };
      }
      if (String(plot.value).trim().length < 50) {
        return { valid: false, error: 'Plot must be at least 50 chars long' };
      }

      return { valid: true, error: '' };
    },
  },
  producer: {
    validate: (producer: MovieFormState['producer']) => {
      if (!producer.selected) {
        return { valid: false, error: 'Producer is required' };
      }

      return { valid: true, error: '' };
    },
  },
  actors: {
    validate: (actor: MovieFormState['actors']) => {
      if (!actor.selected?.length) {
        return { valid: false, error: 'Select at least one actor' };
      }

      return { valid: true, error: '' };
    },
  },
  release_date: {
    validate: (release_date: MovieFormState['release_date']) => {
      if (!release_date.value) {
        return { valid: false, error: 'Release date is required' };
      }
      const date = new Date(String(release_date.value));
      if (date > new Date()) {
        return { valid: false, error: 'Release date cannot be of future' };
      }

      return { valid: true, error: '' };
    },
  },
  poster: {
    validate: (poster: MovieFormState['poster']) => {
      if (!poster) {
        return { valid: false, error: 'Poster is required' };
      }
      return { valid: true, error: '' };
    },
  },
};
