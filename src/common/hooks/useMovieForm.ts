import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';
import { resetForm, setFormTouched, updateFormField, validateForm } from '../../store/movies/slices';
import { createMovieThunk, type CreateMovieThunkPayload } from '../../store/movies/thunks/createMovieThunk';
import type { MovieFormData } from '../../store/movies/types';
import type { RootState } from '../../store/types';

export const useMovieForm = () => {
  const dispatch = useAppDispatch();
  const { form, loading, error } = useSelector((state: RootState) => state.movies);

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
      const result = await dispatch(createMovieThunk(form.data as CreateMovieThunkPayload));
      return createMovieThunk.fulfilled.match(result);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return false;
    }
  }, [dispatch, form.data, form.isValid]);

  return {
    formData: form.data,
    formErrors: form.errors,
    touched: form.touched,
    isValid: form.isValid,
    isDirty: form.isDirty,
    isLoading: loading.create,
    submitError: error.create,
    updateField,
    setTouched,
    validate,
    reset,
    submitForm,
  };
};
