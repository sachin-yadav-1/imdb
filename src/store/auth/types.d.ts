export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  user_metadata?: Record<string, any>;
  created_at?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface FormFieldValue {
  value: string;
  error: string;
}

export interface LoginFormState {
  email: FormFieldValue;
  password: FormFieldValue;
}

export interface SignupFormState {
  email: FormFieldValue;
  password: FormFieldValue;
  confirmPassword: FormFieldValue;
  firstName: FormFieldValue;
  lastName: FormFieldValue;
}

export interface AuthInitialState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  loading: {
    login: boolean;
    signup: boolean;
    logout: boolean;
    checkAuth: boolean;
  };
  error: {
    login: string | null;
    signup: string | null;
    logout: string | null;
    checkAuth: string | null;
  };
  loginForm: LoginFormState;
  signupForm: SignupFormState;
}

export type FormFieldType = 'email' | 'password' | 'text' | 'none';
