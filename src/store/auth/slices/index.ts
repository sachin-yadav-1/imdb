import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  authInitialState,
  loginFormInitialState,
  signupFormInitialState,
  TOKEN_KEYS,
  VALIDATION_PATTERNS,
} from '../constants';

import { checkAuthThunk } from '../thunks/checkAuthThunk';
import { loginThunk } from '../thunks/loginThunk';
import { logoutThunk } from '../thunks/logoutThunk';
import { signupThunk } from '../thunks/signupThunk';
import type { AuthTokens, LoginFormState, SignupFormState, User } from '../types';

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    updateLoginFormField: (
      state,
      action: PayloadAction<{
        field: keyof LoginFormState;
        value: string;
      }>
    ) => {
      const { field, value } = action.payload;
      state.loginForm[field].value = value;

      if (state.loginForm[field].error) {
        state.loginForm[field].error = '';
      }
    },

    validateLoginField: (state, action: PayloadAction<{ field: keyof LoginFormState }>) => {
      const { field } = action.payload;
      const value = state.loginForm[field].value;

      switch (field) {
        case 'email':
          if (!value.trim()) {
            state.loginForm[field].error = 'Email is required';
          } else if (!VALIDATION_PATTERNS.EMAIL.test(value)) {
            state.loginForm[field].error = 'Please enter a valid email';
          }
          break;
        case 'password':
          if (!value.trim()) {
            state.loginForm[field].error = 'Password is required';
          }
          break;
      }
    },

    // Signup
    updateSignupFormField: (
      state,
      action: PayloadAction<{
        field: keyof SignupFormState;
        value: string;
      }>
    ) => {
      const { field, value } = action.payload;
      state.signupForm[field].value = value;

      if (state.signupForm[field].error) {
        state.signupForm[field].error = '';
      }
    },

    validateSignupField: (state, action: PayloadAction<{ field: keyof SignupFormState }>) => {
      const { field } = action.payload;
      const value = state.signupForm[field].value;

      switch (field) {
        case 'email':
          if (!value.trim()) {
            state.signupForm[field].error = 'Email is required';
          } else if (!VALIDATION_PATTERNS.EMAIL.test(value)) {
            state.signupForm[field].error = 'Please enter a valid email';
          }
          break;
        case 'password':
          if (!value.trim()) {
            state.signupForm[field].error = 'Password is required';
          } else if (value.length < VALIDATION_PATTERNS.PASSWORD_MIN_LENGTH) {
            state.signupForm[
              field
            ].error = `Password must be at least ${VALIDATION_PATTERNS.PASSWORD_MIN_LENGTH} characters`;
          }
          break;
        case 'confirmPassword':
          if (!value.trim()) {
            state.signupForm[field].error = 'Please confirm your password';
          } else if (value !== state.signupForm.password.value) {
            state.signupForm[field].error = 'Passwords do not match';
          }
          break;
        case 'firstName':
          if (!value.trim()) {
            state.signupForm[field].error = 'First name is required';
          }
          break;
        case 'lastName':
          if (!value.trim()) {
            state.signupForm[field].error = 'Last name is required';
          }
          break;
      }
    },

    // Auth
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    setTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;

      localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, action.payload.access_token);
      localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, action.payload.refresh_token);
      if (action.payload.expires_at) {
        localStorage.setItem(TOKEN_KEYS.EXPIRES_AT, action.payload.expires_at.toString());
      }
    },

    clearAuth: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;

      localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.EXPIRES_AT);
    },

    resetLoginForm: (state) => {
      state.loginForm = loginFormInitialState;
    },

    resetSignupForm: (state) => {
      state.signupForm = signupFormInitialState;
    },

    clearErrors: (state) => {
      state.error = authInitialState.error;
    },
  },

  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading.login = true;
        state.error.login = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading.login = false;
        state.error.login = null;

        const { user, access_token, refresh_token } = action.payload;

        state.user = {
          id: user.id,
          email: user.email,
          firstName: user.user_metadata?.first_name || '',
          lastName: user.user_metadata?.last_name || '',
          user_metadata: user.user_metadata,
        };

        state.tokens = {
          access_token,
          refresh_token,
          expires_at: Date.now() + 3600 * 1000, // 1 hour from now
        };

        state.isAuthenticated = true;
        state.loginForm = loginFormInitialState;

        localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, access_token);
        localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refresh_token);
        localStorage.setItem(TOKEN_KEYS.EXPIRES_AT, (Date.now() + 3600 * 1000).toString());
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading.login = false;
        state.error.login = action.payload as string;
      });

    // SIGNUP
    builder
      .addCase(signupThunk.pending, (state) => {
        state.loading.signup = true;
        state.error.signup = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.loading.signup = false;
        state.error.signup = null;

        const { user, access_token, refresh_token, emailConfirmationRequired } = action.payload;

        if (!emailConfirmationRequired && access_token && refresh_token) {
          state.user = {
            id: user.id,
            email: user.email,
            firstName: user.user_metadata?.first_name || '',
            lastName: user.user_metadata?.last_name || '',
            user_metadata: user.user_metadata,
          };

          state.tokens = {
            access_token,
            refresh_token,
            expires_at: Date.now() + 3600 * 1000, // 1 hour from now
          };

          state.isAuthenticated = true;

          localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, access_token);
          localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refresh_token);
          localStorage.setItem(TOKEN_KEYS.EXPIRES_AT, (Date.now() + 3600 * 1000).toString());
        }

        state.signupForm = signupFormInitialState;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading.signup = false;
        state.error.signup = action.payload as string;
      });

    // LOGOUT
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading.logout = true;
        state.error.logout = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading.logout = false;
        state.error.logout = null;
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;

        localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.EXPIRES_AT);
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading.logout = false;
        state.error.logout = action.payload as string;
      });

    // CHECK AUTH
    builder
      .addCase(checkAuthThunk.pending, (state) => {
        state.loading.checkAuth = true;
        state.error.checkAuth = null;
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.loading.checkAuth = false;
        state.error.checkAuth = null;

        if (action.payload) {
          const { user, tokens } = action.payload;
          state.user = user;
          state.tokens = tokens;
          state.isAuthenticated = true;
        }
      })
      .addCase(checkAuthThunk.rejected, (state, action) => {
        state.loading.checkAuth = false;
        state.error.checkAuth = action.payload as string;
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;

        localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.EXPIRES_AT);
      });
  },
});

export const {
  updateLoginFormField,
  validateLoginField,
  updateSignupFormField,
  validateSignupField,
  setUser,
  setTokens,
  clearAuth,
  resetLoginForm,
  resetSignupForm,
  clearErrors,
} = authSlice.actions;

export default authSlice.reducer;
