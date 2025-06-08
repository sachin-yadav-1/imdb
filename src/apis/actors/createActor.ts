import type { Actor } from '../../store/actors/types';
import API_CLIENT, { type QueryResult } from '../client';
import { TABLES } from '../constants';
import type { ApiResponse } from '../types';

interface CreateActorApiPayload {
  name: string;
  dob?: string;
  bio?: string;
  gender?: string;
}
export const createActor = async (data: CreateActorApiPayload): Promise<ApiResponse<Actor>> => {
  if (!data.name) {
    throw new Error('name is required');
  }

  const { data: newActor, error } = await API_CLIENT.from(TABLES.ACTORS).insert([data]).select().single();

  if (error) {
    throw error;
  }

  return {
    success: true,
    error: null,
    data: newActor as QueryResult<Actor>,
  };
};
