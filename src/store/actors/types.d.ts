export interface Actor {
  id: number;
  name: string;
  gender: string;
  dob: string;
  bio: string;
  image: string;
  created_at: string;
}

export interface PersonFormData {
  name: string;
  bio: string;
  dob: string;
  gender: string;
}

export interface PersonFormErrors {
  name?: string;
  bio?: string;
  dob?: string;
  gender?: string;
}

export interface ActorMovie {
  id: number;
  actor_id: number;
  movie_id: number;
  created_at: string;
}

export interface PersonFormState {
  data: PersonFormData;
  errors: PersonFormErrors;
  touched: Record<keyof PersonFormData, boolean>;
  isValid: boolean;
  isDirty: boolean;
}

export interface ActorsInitialState {
  entities: Record<number, Actor>;
  ids: number[];
  searchResults: Actor[];
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
