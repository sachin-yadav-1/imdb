import type { ActorMovie } from '../actors/types';
import type { Producer } from '../producers/types';

export interface Movie {
  id: number;
  name: string;
  plot: string;
  release_date: string;
  poster: string;
  producer?: Producer;
  producer_id: number;
  actor_movie?: ActorMovie[];
  actor_ids?: number[];
  created_at?: string;
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
    fetch: string | null;
    fetchSingle: string | null;
    create: string | null;
    update: string | null;
  };
}
