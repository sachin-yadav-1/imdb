import { Box } from '@mui/material';
import { memo, useCallback, useState } from 'react';
import { useMovieForm } from '../../../common/hooks/useMovieForm';
import { useAppDispatch } from '../../../store/hooks';
import { resetForm } from '../../../store/movies/slices';
import Button from '../../atoms/Button';
import FormInput from '../../atoms/FormInput';

const STYLES = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    padding: '2.5rem 0',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
};
const AddMovieForm = () => {
  const dispatch = useAppDispatch();
  const [resetKey, setResetKey] = useState(0);
  const { formData, formErrors, touched, isValid, isLoading, updateField, setTouched, submitForm } = useMovieForm();

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateField('name', e.target.value);
    },
    [updateField]
  );
  const handleNameBlur = useCallback(() => {
    setTouched('name');
  }, [setTouched]);

  const handleReleaseDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateField('release_date', e.target.value);
    },
    [updateField]
  );

  const handleReleaseDateBlur = useCallback(() => {
    setTouched('release_date');
  }, [setTouched]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const success = await submitForm();
      if (success) {
        setResetKey((prev) => prev + 1);
      }
    },
    [submitForm]
  );

  const handleReset = useCallback(() => {
    dispatch(resetForm());
    setResetKey((prev) => prev + 1);
  }, [dispatch]);

  return (
    <Box key={resetKey} component="form" noValidate sx={STYLES.root} onSubmit={handleSubmit}>
      <FormInput
        label="Movie Name"
        value={formData.name}
        onChange={handleNameChange}
        onBlur={handleNameBlur}
        error={touched.name && Boolean(formErrors.name)}
        helperText={touched.name ? formErrors.name : ''}
        required
        disabled={isLoading}
        size="small"
        placeholder="Enter movie name"
      />

      <FormInput
        label="Release Date"
        type="date"
        value={formData.release_date}
        onChange={handleReleaseDateChange}
        onBlur={handleReleaseDateBlur}
        error={touched.release_date && Boolean(formErrors.release_date)}
        helperText={touched.release_date ? formErrors.release_date : ''}
        required
        disabled={isLoading}
        size="small"
      />

      <Box sx={STYLES.actions}>
        <Button variant="outlined" type="button" size="small" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="contained" type="submit" size="small" disabled={isLoading || !isValid}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default memo(AddMovieForm);
