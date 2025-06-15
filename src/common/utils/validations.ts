import type { CreatePersonFormState, Validate } from '../types';

export const PERSON_FORM_VALIDATIONS: Record<keyof CreatePersonFormState, Validate> = {
  name: {
    validate: (name: CreatePersonFormState['name']) => {
      if (!String(name.value)?.trim()) {
        return { valid: false, error: 'Name is rquired' };
      }
      return { valid: true, error: '' };
    },
  },
  dob: {
    validate: (dob: CreatePersonFormState['dob']) => {
      if (!dob.value) {
        return { valid: false, error: 'DOB is required' };
      }
      if (dob.value) {
        const dobYear = new Date(dob.value as string)?.getFullYear();
        const currentYear = new Date().getFullYear();

        if (currentYear - dobYear < 10) {
          return { valid: false, error: 'Person should be at least 10yr old' };
        }
      }

      return { valid: true, error: '' };
    },
  },
  gender: {
    validate: (gender: CreatePersonFormState['gender']) => {
      return { valid: true, error: '' };
    },
  },
  bio: {
    validate: (bio: CreatePersonFormState['bio']) => {
      if (bio.value && (bio.value as string)?.length < 50) {
        return { valid: false, error: 'Bio should be at least 50 char long' };
      }
      return { valid: true, error: '' };
    },
  },
};
