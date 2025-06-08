import type { Producer } from '../../store/producers/types';
import API_CLIENT, { type QueryResult } from '../client';
import { TABLES } from '../constants';
import type { ApiResponse } from '../types';

export interface CreateProducerApiPayload {
  name: string;
  dob?: string;
  bio?: string;
  gender?: string;
}
export const createProducer = async (data: CreateProducerApiPayload): Promise<ApiResponse<Producer>> => {
  if (!data.name) {
    throw new Error('name is required');
  }

  const { data: newProducer, error } = await API_CLIENT.from(TABLES.PRODUCERS).insert([data]).select().single();

  if (error) {
    throw error;
  }

  return {
    success: true,
    data: newProducer as QueryResult<Producer>,
    error: null,
  };
};
