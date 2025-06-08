import type { PersonFormState } from '../actors/types';

export interface Producer {
  id: number;
  name: string;
  bio: string;
  dob: string;
  gender: string;
  created_at: string;
}

export interface ProducersInitialState {
  entities: Record<number, Producer>;
  ids: number[];
  searchResults: Producer[];
  loading: {
    create: boolean;
    search: boolean;
  };
  error: {
    create: string | null;
    search: string | null;
  };
  createForm: PersonFormState;
}
