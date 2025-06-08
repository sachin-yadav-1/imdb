import { Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import React, { memo, useCallback, useEffect } from 'react';
import FormInput from '../../atoms/FormInput';
import FormSelect from '../../molecules/FormSelect/FormSelect';
import { useCreateActorForm } from './hooks/useCreateActorForm';
import { useCreateProducerForm } from './hooks/useCreateProducerForm';

interface CreatePersonFormProps {
  open: boolean;
  type: 'actor' | 'producer';
  onClose: () => void;
  onSuccess?: () => void;
}

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const CreatePersonForm: React.FC<CreatePersonFormProps> = ({ open, type, onClose, onSuccess }) => {
  const actorForm = useCreateActorForm();
  const producerForm = useCreateProducerForm();

  const form = type === 'actor' ? actorForm : producerForm;
  const { formData, formErrors, touched, isValid, isLoading, updateField, setTouched, submitForm, reset } = form;

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        const success = await submitForm();
        if (success) {
          onSuccess?.();
          handleClose();
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
    [submitForm, onSuccess, handleClose]
  );

  const handleFieldBlur = useCallback(
    (field: keyof typeof formData) => {
      setTouched(field);
    },
    [setTouched]
  );

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const title = `Create New ${type === 'actor' ? 'Actor' : 'Producer'}`;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '2rem',
          fontWeight: 600,
        }}
      >
        {title}
        <IconButton onClick={handleClose} disabled={isLoading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ padding: '2rem' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <FormInput
              label="Name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              onBlur={() => handleFieldBlur('name')}
              error={touched.name && Boolean(formErrors.name)}
              helperText={touched.name ? formErrors.name : ''}
              required
              disabled={isLoading}
              placeholder={`Enter ${type} name`}
            />

            <FormInput
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChange={(e) => updateField('dob', e.target.value)}
              onBlur={() => handleFieldBlur('dob')}
              error={touched.dob && Boolean(formErrors.dob)}
              helperText={touched.dob ? formErrors.dob : ''}
              required
              disabled={isLoading}
            />

            <FormSelect
              label="Gender"
              value={formData.gender}
              onChange={(e) => updateField('gender', e.target.value)}
              onBlur={() => handleFieldBlur('gender')}
              error={touched.gender && Boolean(formErrors.gender)}
              helperText={touched.gender ? formErrors.gender : ''}
              required
              disabled={isLoading}
              placeholder="Select gender"
              options={GENDER_OPTIONS}
            />

            <FormInput
              fullWidth
              multiline
              rows={4}
              label="Bio"
              value={formData.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              onBlur={() => handleFieldBlur('bio')}
              error={touched.bio && Boolean(formErrors.bio)}
              helperText={touched.bio ? formErrors.bio : ''}
              required
              disabled={isLoading}
              placeholder={`Enter ${type} biography...`}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ padding: '1rem 2rem 2rem' }}>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            variant="outlined"
            size="large"
            sx={{ fontSize: '1.4rem', fontWeight: 500 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            variant="contained"
            size="large"
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            sx={{ fontSize: '1.4rem', fontWeight: 500 }}
          >
            {isLoading ? 'Creating...' : `Create ${type === 'actor' ? 'Actor' : 'Producer'}`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default memo(CreatePersonForm);
