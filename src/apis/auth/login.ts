import API_CLIENT from '../client';
import type { ApiResponse } from '../types';

interface LoginApiPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    user_metadata: Record<string, any>;
  };
  access_token: string;
  refresh_token: string;
}

export const login = async (data: LoginApiPayload): Promise<ApiResponse<LoginResponse>> => {
  if (!data.email || !data.password) {
    throw new Error('Email and password are required');
  }

  const { data: authData, error } = await API_CLIENT.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw error;
  }

  if (!authData.user || !authData.session) {
    throw new Error('Authentication failed');
  }

  return {
    success: true,
    error: null,
    data: {
      user: {
        id: authData.user.id,
        email: authData.user.email || '',
        user_metadata: authData.user.user_metadata || {},
      },
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
    } as LoginResponse,
  };
};
