import type { MovieFormState, MoviesInitialState } from './types';

export const movieFormInitialState: MovieFormState = {
  data: {
    name: '',
    plot: '',
    poster: '',
    actor_ids: [],
    release_date: '',
    posterFile: null,
    producer_id: null,
  },
  errors: {},
  touched: {
    name: false,
    plot: false,
    release_date: false,
    poster: false,
    producer_id: false,
    actor_ids: false,
    posterFile: false,
  },
  isValid: false,
  isDirty: false,
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
  form: movieFormInitialState,
};

export const ERROR_MESSAGES = {
  name: {
    required: 'Movie name is required',
    minLength: 'Movie name must be at least 2 characters',
    maxLength: 'Movie name must be less than 100 characters',
  },
  plot: {
    required: 'Plot is required',
    minLength: 'Plot must be at least 10 characters',
    maxLength: 'Plot must be less than 1000 characters',
  },
  release_date: {
    required: 'Release date is required',
    invalid: 'Please enter a valid date',
    future: 'Release date cannot be in the future',
  },
  poster: {
    required: 'Poster is required',
    invalidUrl: 'Please provide a valid image URL',
  },
  posterFile: {
    required: 'Poster image is required',
    invalidType: 'Please upload a valid image file (JPEG, PNG, WebP)',
    tooLarge: 'Image file must be less than 5MB',
  },
  producer_id: {
    required: 'Producer is required',
  },
  actor_ids: {
    required: 'At least one actor must be selected',
  },
  general: {
    createFailed: 'Failed to create movie. Please try again.',
    updateFailed: 'Failed to update movie. Please try again.',
    networkError: 'Network error. Please check your connection.',
    unexpectedError: 'An unexpected error occurred.',
  },
} as const;

export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  plot: {
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
  release_date: {
    required: true,
  },
  poster: {
    required: true,
  },
  producer_id: {
    required: true,
  },
  actor_ids: {
    required: true,
    minItems: 1,
  },
} as const;
