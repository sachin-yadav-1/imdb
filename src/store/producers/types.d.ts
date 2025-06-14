export interface Producer {
  id: number;
  name: string;
  bio: string;
  dob: string;
  gender: string;
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
export interface CreateProducerFormState {
  name: FormFieldValue;
  dob: FormFieldValue;
  gender: FormFieldValue;
  bio: FormFieldValue;
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
  createForm: CreateProducerFormState;
}

export type FormFieldType = 'select' | 'multi-select' | 'file' | 'none';
