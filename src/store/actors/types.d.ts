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

export interface FormFieldValue {
  value: string;
  error: string;
  selected?: any;
}

export type Validate = {
  validate: (val: any) => { valid: boolean; error: string };
};
export interface CreateActorFormState {
  name: FormFieldValue;
  dob: FormFieldValue;
  gender: FormFieldValue;
  bio: FormFieldValue;
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
  createForm: CreateActorFormState;
}

export type FormFieldType = 'select' | 'multi-select' | 'file' | 'none';
