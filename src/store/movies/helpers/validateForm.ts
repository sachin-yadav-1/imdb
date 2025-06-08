import { ERROR_MESSAGES, VALIDATION_RULES } from '../constants';
import type { MovieFormData, MovieFormErrors } from '../types';

export const validateMovieForm = (data: MovieFormData): MovieFormErrors => {
  const errors: MovieFormErrors = {};

  if (!data.name.trim()) {
    errors.name = ERROR_MESSAGES.name.required;
  } else if (data.name.trim().length < VALIDATION_RULES.name.minLength) {
    errors.name = ERROR_MESSAGES.name.minLength;
  } else if (data.name.trim().length > VALIDATION_RULES.name.maxLength) {
    errors.name = ERROR_MESSAGES.name.maxLength;
  }

  if (!data.plot.trim()) {
    errors.plot = ERROR_MESSAGES.plot.required;
  } else if (data.plot.trim().length < VALIDATION_RULES.plot.minLength) {
    errors.plot = ERROR_MESSAGES.plot.minLength;
  } else if (data.plot.trim().length > VALIDATION_RULES.plot.maxLength) {
    errors.plot = ERROR_MESSAGES.plot.maxLength;
  }

  if (!data.release_date) {
    errors.release_date = ERROR_MESSAGES.release_date.required;
  } else {
    const releaseDate = new Date(data.release_date);
    const currentDate = new Date();

    if (isNaN(releaseDate.getTime())) {
      errors.release_date = ERROR_MESSAGES.release_date.invalid;
    } else if (releaseDate > currentDate) {
      errors.release_date = ERROR_MESSAGES.release_date.future;
    }
  }

  if (!data.posterFile && !data.poster.trim()) {
    errors.poster = ERROR_MESSAGES.poster.required;
  } else if (data.poster && !data.posterFile) {
    // If poster is a URL, validate URL format
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
    if (!urlPattern.test(data.poster)) {
      errors.poster = ERROR_MESSAGES.poster.invalidUrl;
    }
  }

  if (data.posterFile) {
    const file = data.posterFile;
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      errors.posterFile = ERROR_MESSAGES.posterFile.invalidType;
    } else if (file.size > maxSize) {
      errors.posterFile = ERROR_MESSAGES.posterFile.tooLarge;
    }
  }

  if (!data.producer_id) {
    errors.producer_id = ERROR_MESSAGES.producer_id.required;
  }

  if (!data.actor_ids.length) {
    errors.actor_ids = ERROR_MESSAGES.actor_ids.required;
  }

  return errors;
};
