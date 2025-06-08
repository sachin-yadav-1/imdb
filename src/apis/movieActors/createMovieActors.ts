import API_CLIENT, { type QueryResult } from '../client';
import type { ActorMovie } from '../../store/actors/types';
import type { ApiResponse } from '../types';
import { TABLES } from '../constants';

interface CreateActorsMoviePayload {
  actor_id: number;
  movie_id: number;
}

export const createMovieActors = async (data: CreateActorsMoviePayload[]): Promise<ApiResponse<ActorMovie>> => {
  const { data: newActorMovie, error } = await API_CLIENT.from(TABLES.ACTOR_MOVIE).insert(data).select();

  if (error) {
    throw error;
  }

  return {
    success: true,
    data: newActorMovie[0] as QueryResult<ActorMovie>,
    error: null,
  };
};
