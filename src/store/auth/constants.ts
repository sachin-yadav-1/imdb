import type { AuthInitialState, LoginFormState, SignupFormState } from './types';

export const loginFormInitialState: LoginFormState = {
  email: {
    value: '',
    error: '',
  },
  password: {
    value: '',
    error: '',
  },
};

export const signupFormInitialState: SignupFormState = {
  email: {
    value: '',
    error: '',
  },
  password: {
    value: '',
    error: '',
  },
  confirmPassword: {
    value: '',
    error: '',
  },
  firstName: {
    value: '',
    error: '',
  },
  lastName: {
    value: '',
    error: '',
  },
};

export const authInitialState: AuthInitialState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  loading: {
    login: false,
    signup: false,
    logout: false,
    checkAuth: false,
  },
  error: {
    login: null,
    signup: null,
    logout: null,
    checkAuth: null,
  },
  loginForm: loginFormInitialState,
  signupForm: signupFormInitialState,
};

export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'imdb_access_token',
  REFRESH_TOKEN: 'imdb_refresh_token',
  EXPIRES_AT: 'imdb_expires_at',
} as const;

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
} as const;
