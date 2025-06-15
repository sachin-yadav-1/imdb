import API_CLIENT from '../client';
import type { ApiResponse } from '../types';

export const logout = async (): Promise<ApiResponse<null>> => {
  const { error } = await API_CLIENT.auth.signOut();

  if (error) {
    throw error;
  }

  return {
    success: true,
    error: null,
    data: null,
  };
};
