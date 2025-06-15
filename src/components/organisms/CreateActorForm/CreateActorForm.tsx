import { Close } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
} from '@mui/material';
import { createSelector } from '@reduxjs/toolkit';
import { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { CreatePersonFormState, CustomEvent, FormFieldType } from '../../../common/types';
import { GENDER_OPTIONS } from '../../../common/utils/constants';
import { resetActorForm, updateFormData, validateForm, validateFormField } from '../../../store/actors/slices';
import createActorThunk from '../../../store/actors/thunks/createActorThunk';
import { closeCreateActorModal } from '../../../store/common/slices';
import { useAppDispatch } from '../../../store/hooks';
import type { RootState } from '../../../store/types';
import Button from '../../atoms/Button';
import FormField from '../../molecules/FormField';

const STYLES = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  searchRoot: {
    width: '100%',
  },
  label: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '1rem',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '1rem',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '2rem',
    fontWeight: 600,
  },
};

const selectFormData = createSelector(
  (state: RootState) => state.actors.createForm,
  (form) => ({
    name: form.name.value || '',
    nameError: form.name.error || '',
    bio: form.bio.value || '',
    bioError: form.bio.error,
    dob: form.dob.value || '',
    dobError: form.dob.error || '',
    gender: form.gender.value || '',
    genderError: form.gender.error || '',
  })
);

interface CreateActorFormProps {
  open: boolean;
  onClose: () => void;
}

const CreateActorForm: React.FC<CreateActorFormProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const formData = useSelector(selectFormData);
  const createActorLoading = useSelector((state: RootState) => state.actors.loading.create) || false;

  const isFormValid = useMemo(() => {
    const hasRequiredFields = !!formData.name?.trim();

    const hasNoErrors = !(formData.nameError || formData.dobError || formData.genderError || formData.bioError);

    return hasRequiredFields && hasNoErrors;
  }, [formData.name, formData.nameError, formData.dobError, formData.genderError, formData.bioError]);

  const handleFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | CustomEvent) => {
      const key = e.target.name as keyof CreatePersonFormState;
      const type: FormFieldType = (e.target.dataset?.type as FormFieldType) || 'none';
      const value = e.target.value || '';
      dispatch(updateFormData({ key, value, type }));
    },
    [dispatch]
  );

  const handleFieldBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const key = e.target.name as keyof CreatePersonFormState;
      dispatch(validateFormField({ key }));
    },
    [dispatch]
  );

  const handleCreateActor = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      dispatch(validateForm());

      if (!isFormValid) {
        return;
      }

      const createActorPayload = {
        name: formData.name || '',
        bio: formData.bio || '',
        dob: formData.dob || '',
        gender: formData.gender || '',
      };

      const result = await dispatch(createActorThunk(createActorPayload as any));

      const success = createActorThunk.fulfilled.match(result);
      if (success) {
        dispatch(resetActorForm());
        dispatch(closeCreateActorModal());
      }
    },
    [formData, dispatch, isFormValid]
  );

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle sx={STYLES.title}>
        Create New Actor
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" sx={STYLES.root} onSubmit={handleCreateActor}>
          <FormField
            name="name"
            label="Name"
            required
            fullWidth
            value={formData.name}
            error={formData.nameError}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />

          <FormField
            name="dob"
            label="DOB"
            type="date"
            fullWidth
            value={formData.dob}
            error={formData.dobError}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />

          <FormControl fullWidth>
            <FormLabel sx={STYLES.label}>Gender</FormLabel>
            <Select name="gender" id="select" value={formData.gender} onChange={handleFieldChange}>
              {GENDER_OPTIONS.map((op) => (
                <MenuItem key={op.value} value={op.value}>
                  {op.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormField
            multiline
            rows={4}
            name="bio"
            label="Bio"
            fullWidth
            value={formData.bio}
            error={formData.bioError}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />

          <Box sx={STYLES.formActions}>
            <Button type="button" variant="outlined" disableElevation disabled={createActorLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={createActorLoading || !isFormValid}
              startIcon={createActorLoading ? <CircularProgress size={20} /> : null}
            >
              Create
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default memo(CreateActorForm);
