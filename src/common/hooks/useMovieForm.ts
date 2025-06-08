import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';
import {
  resetForm,
  setFormTouched,
  updateFormField,
  validateForm,
  populateFormForEdit,
  initializeFormForCreate,
} from '../../store/movies/slices';
import { createMovieThunk, type CreateMovieThunkPayload } from '../../store/movies/thunks/createMovieThunk';
import { updateMovieThunk, type UpdateMovieThunkPayload } from '../../store/movies/thunks/updateMovieThunk';
import type { MovieFormData } from '../../store/movies/types';
import type { RootState } from '../../store/types';

interface UseMovieFormProps {
  mode: 'create' | 'edit';
  movieId?: number;
}

export const useMovieForm = ({ mode, movieId }: UseMovieFormProps) => {
  const dispatch = useAppDispatch();
  const { form, loading, error, entities } = useSelector((state: RootState) => state.movies);

  useEffect(() => {
    if (mode === 'edit' && movieId && entities[movieId]) {
      dispatch(populateFormForEdit(entities[movieId]));
    } else if (mode === 'create') {
      dispatch(initializeFormForCreate());
    }
  }, [dispatch, mode, movieId, entities]);

  const updateField = useCallback(
    (field: keyof MovieFormData, value: unknown) => {
      dispatch(updateFormField({ field, value }));
    },
    [dispatch]
  );

  const setTouched = useCallback(
    (field: keyof MovieFormData) => {
      dispatch(setFormTouched(field));
    },
    [dispatch]
  );

  const validate = useCallback(() => {
    dispatch(validateForm());
    return form.isValid;
  }, [dispatch, form.isValid]);

  const reset = useCallback(() => {
    dispatch(resetForm());
  }, [dispatch]);

  const submitForm = useCallback(async () => {
    dispatch(validateForm());

    if (!form.isValid) {
      return false;
    }

    try {
      let result;

      if (mode === 'create') {
        result = await dispatch(createMovieThunk(form.data as CreateMovieThunkPayload));
        return createMovieThunk.fulfilled.match(result);
      } else {
        if (!movieId) {
          throw new Error('Movie ID is required for edit mode');
        }

        result = await dispatch(
          updateMovieThunk({
            id: movieId,
            data: form.data as UpdateMovieThunkPayload,
          })
        );
        return updateMovieThunk.fulfilled.match(result);
      }
    } catch (err) {
      return false;
    }
  }, [dispatch, form.data, form.isValid, mode, movieId]);

  return {
    formData: form.data,
    formErrors: form.errors,
    touched: form.touched,
    isValid: form.isValid,
    isDirty: form.isDirty,
    isLoading: mode === 'create' ? loading.create : loading.update,
    submitError: mode === 'create' ? error.create : error.update,
    updateField,
    setTouched,
    validate,
    reset,
    submitForm,
    mode,
  };
};
