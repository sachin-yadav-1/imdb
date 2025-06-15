import type { Actor } from '../actors/types';
import type { Producer } from '../producers/types';

export interface Movie {
  id: number;
  name: string;
  plot: string;
  release_date: string;
  poster: string;
  producer?: Producer;
  actor_ids?: number[];
  created_at?: string;
}

export interface MovieWithActorsAndProducers extends Movie {
  producer_id?: Producer;
  actor_movie?: Array<{
    actors: Actor;
  }>;
}

export interface MovieFormState {
  name: FormFieldValue;
  plot: FormFieldValue;
  producer: FormFieldValue;
  actors: FormFieldValue;
  release_date: FormFieldValue;
  poster: FormFieldValue;
  isValid?: boolean;
}

export interface MoviesInitialState {
  entities: Record<number, Movie>;
  ids: number[];
  loading: {
    fetch: boolean;
    fetchSingle: boolean;
    create: boolean;
    update: boolean;
  };
  error: {
    fetch: Error | null;
    fetchSingle: Error | null;
    create: Error | null;
    update: Error | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  createForm: MovieFormState;
  editForm: MovieFormState;
}

type FormTypeKey = 'createForm' | 'editForm';
