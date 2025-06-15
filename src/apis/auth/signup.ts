import API_CLIENT from '../client';
import type { ApiResponse } from '../types';

interface SignupApiPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface SignupResponse {
  user: {
    id: string;
    email: string;
    user_metadata: Record<string, any>;
  };
  access_token?: string;
  refresh_token?: string;
  emailConfirmationRequired: boolean;
}

export const signup = async (data: SignupApiPayload): Promise<ApiResponse<SignupResponse>> => {
  if (!data.email || !data.password) {
    throw new Error('Email and password are required');
  }

  if (data.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  const { data: authData, error } = await API_CLIENT.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName || '',
        last_name: data.lastName || '',
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!authData.user) {
    throw new Error('Signup failed');
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
      access_token: authData.session?.access_token,
      refresh_token: authData.session?.refresh_token,
      emailConfirmationRequired: true,
    } as SignupResponse,
  };
};
