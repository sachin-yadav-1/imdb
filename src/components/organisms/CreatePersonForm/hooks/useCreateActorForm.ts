import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  resetCreateForm,
  setCreateFormTouched,
  updateCreateFormField,
  validateCreateForm,
} from '../../../../store/actors/slices';
import createActorThunk, { type CreateActorPayload } from '../../../../store/actors/thunks/createActorThunk';
import type { PersonFormData } from '../../../../store/actors/types';
import { useAppDispatch } from '../../../../store/hooks';
import type { RootState } from '../../../../store/types';

export const useCreateActorForm = () => {
  const dispatch = useAppDispatch();
  const { createForm, loading, error } = useSelector((state: RootState) => state.actors);

  const updateField = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (field: keyof PersonFormData, value: any) => {
      dispatch(updateCreateFormField({ field, value }));
    },
    [dispatch]
  );

  const setTouched = useCallback(
    (field: keyof PersonFormData) => {
      dispatch(setCreateFormTouched(field));
    },
    [dispatch]
  );

  const validate = useCallback(() => {
    dispatch(validateCreateForm());
    return createForm.isValid;
  }, [dispatch, createForm.isValid]);

  const reset = useCallback(() => {
    dispatch(resetCreateForm());
  }, [dispatch]);

  const submitForm = useCallback(async () => {
    dispatch(validateCreateForm());

    if (!createForm.isValid) {
      return false;
    }

    try {
      const result = await dispatch(createActorThunk(createForm.data as CreateActorPayload));
      return createActorThunk.fulfilled.match(result);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }, [dispatch, createForm.data, createForm.isValid]);

  return {
    formData: createForm.data,
    formErrors: createForm.errors,
    touched: createForm.touched,
    isValid: createForm.isValid,
    isDirty: createForm.isDirty,
    isLoading: loading.create,
    submitError: error.create,
    updateField,
    setTouched,
    validate,
    reset,
    submitForm,
  };
};
