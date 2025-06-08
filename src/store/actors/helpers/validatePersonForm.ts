import type { PersonFormData, PersonFormErrors } from '../../../store/actors/types';

export const validatePersonForm = (data: PersonFormData, type: 'actor' | 'producer'): PersonFormErrors => {
  const errors: PersonFormErrors = {};

  if (!data.name.trim()) {
    errors.name = `${type === 'actor' ? 'Actor' : 'Producer'} name is required`;
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }

  if (!data.bio.trim()) {
    errors.bio = 'Bio is required';
  } else if (data.bio.trim().length < 10) {
    errors.bio = 'Bio must be at least 10 characters';
  } else if (data.bio.trim().length > 500) {
    errors.bio = 'Bio must be less than 500 characters';
  }

  if (!data.dob) {
    errors.dob = 'Date of birth is required';
  } else {
    const dobDate = new Date(data.dob);
    const currentDate = new Date();
    if (dobDate > currentDate) {
      errors.dob = 'Date of birth cannot be in the future';
    }
  }

  if (!data.gender.trim()) {
    errors.gender = 'Gender is required';
  }

  return errors;
};
