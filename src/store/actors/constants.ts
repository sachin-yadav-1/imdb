import type { ActorsInitialState, CreateActorFormState, Validate } from './types';

export const personFormInitialState: CreateActorFormState = {
  name: {
    value: '',
    error: '',
  },
  dob: {
    value: '',
    error: '',
  },
  gender: {
    value: '',
    error: '',
  },
  bio: {
    value: '',
    error: '',
  },
};

export const actorsInitialState: ActorsInitialState = {
  entities: {},
  ids: [],
  searchResults: [],
  loading: {
    create: false,
    search: false,
  },
  error: {
    create: null,
    search: null,
  },
  createForm: personFormInitialState,
};

export const ACTOR_FORM_VALIDATIONS: Record<keyof CreateActorFormState, Validate> = {
  name: {
    validate: (name: CreateActorFormState['name']) => {
      if (!String(name.value)?.trim()) {
        return { valid: false, error: 'Name is rquired' };
      }
      return { valid: true, error: '' };
    },
  },
  dob: {
    validate: (dob: CreateActorFormState['dob']) => {
      if (dob.value) {
        const dobYear = new Date(dob.value)?.getFullYear();
        const currentYear = new Date().getFullYear();

        if (currentYear - dobYear < 10) {
          return { valid: false, error: 'Actor should be at least 10Yr old' };
        }
      }

      return { valid: true, error: '' };
    },
  },
  gender: {
    validate: (gender: CreateActorFormState['gender']) => {
      return { valid: true, error: '' };
    },
  },
  bio: {
    validate: (bio: CreateActorFormState['bio']) => {
      if (bio.value && bio.value.length < 50) {
        return { valid: false, error: 'Bio should be at least 50 char long' };
      }
      return { valid: true, error: '' };
    },
  },
};
