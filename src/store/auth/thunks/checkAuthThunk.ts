import { createAsyncThunk } from '@reduxjs/toolkit';
import API_CLIENT from '../../../apis/client';
import { TOKEN_KEYS } from '../constants';
import type { AuthTokens, User } from '../types';

export const checkAuthThunk = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    const expiresAt = localStorage.getItem(TOKEN_KEYS.EXPIRES_AT);

    if (!accessToken || !refreshToken) {
      throw new Error('No tokens found');
    }

    const now = Date.now();
    const tokenExpiry = expiresAt ? parseInt(expiresAt, 10) : 0;

    if (tokenExpiry && now > tokenExpiry) {
      const { data, error } = await API_CLIENT.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error || !data.session) {
        throw new Error('Token refresh failed');
      }

      const newTokens: AuthTokens = {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: Date.now() + 3600 * 1000, // 1 hour from now
      };

      const user: User = {
        id: data.user?.id || '',
        email: data.user?.email || '',
        firstName: data.user?.user_metadata?.first_name || '',
        lastName: data.user?.user_metadata?.last_name || '',
        user_metadata: data.user?.user_metadata || {},
      };

      localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, newTokens.access_token);
      localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, newTokens.refresh_token);
      localStorage.setItem(TOKEN_KEYS.EXPIRES_AT, newTokens.expires_at!.toString());

      return { user, tokens: newTokens };
    }

    const { data: userData, error: userError } = await API_CLIENT.auth.getUser(accessToken);

    if (userError || !userData.user) {
      throw new Error('Failed to get user data');
    }

    const user: User = {
      id: userData.user.id,
      email: userData.user.email || '',
      firstName: userData.user.user_metadata?.first_name || '',
      lastName: userData.user.user_metadata?.last_name || '',
      user_metadata: userData.user.user_metadata || {},
    };

    const tokens: AuthTokens = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: tokenExpiry,
    };

    return { user, tokens };
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Authentication check failed');
  }
});
