export type Validate = {
  validate: (val: any) => { valid: boolean; error: string };
};

export type FormFieldType = 'select' | 'multi-select' | 'file' | 'none';

export interface FormFieldValue {
  value: string | File | null;
  error: string;
  selected?: any | any[];
}

export interface CreatePersonFormState {
  name: FormFieldValue;
  dob: FormFieldValue;
  gender: FormFieldValue;
  bio: FormFieldValue;
}

export interface CustomEvent {
  target: { name: string; value: string; dataset?: { type?: string } };
}
