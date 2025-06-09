import { Box, CircularProgress } from '@mui/material';
import { memo, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMovieForm } from '../../../common/hooks/useMovieForm';
import searchActorsThunk from '../../../store/actors/thunks/searchActorsThunk';
import type { Actor } from '../../../store/actors/types';
import {
  closeCreateActorModal,
  closeCreateProducerModal,
  openCreateActorModal,
  openCreateProducerModal,
} from '../../../store/common/slices';
import { useAppDispatch } from '../../../store/hooks';
import searchProducersThunk from '../../../store/producers/thunks/searchProducersThunk';
import type { Producer } from '../../../store/producers/types';
import type { RootState } from '../../../store/types';
import Button from '../../atoms/Button';
import FormInput from '../../atoms/FormInput';
import FileUpload from '../../molecules/FileUpload';
import FormSearch from '../../molecules/FormSearch';
import CreatePersonForm from '../CreatePersonForm';
import { getPersonOptionLabel, isPersonOptionEqualToValue } from './helpers';

interface MovieFormProps {
  mode: 'create' | 'edit';
  movieId?: number;
  onSuccess?: (movieId?: number) => void;
  onCancel?: () => void;
}

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

const MovieForm: React.FC<MovieFormProps> = ({ mode, movieId, onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const [resetKey, setResetKey] = useState(0);
  
  const { 
    formData, 
    formErrors, 
    touched, 
    isValid, 
    isLoading, 
    updateField, 
    setTouched, 
    submitForm,
    reset
  } = useMovieForm({ mode, movieId });

  const { actorOptions, actorLoading, producerOptions, producerLoading, modals } = useSelector((state: RootState) => ({
    actorOptions: state.actors.searchResults || [],
    actorLoading: state.actors.loading.search,
    producerOptions: state.producers.searchResults || [],
    producerLoading: state.producers.loading.search,
    modals: state.common.modal,
  }));

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

  const handleActorChange = useCallback(
    (_: React.SyntheticEvent<Element, Event>, newValue: unknown) => {
      const actorIds = (newValue as Actor[]).map((actor) => actor.id);
      updateField('actor_ids', actorIds);
    },
    [updateField]
  );

  const handleActorInputChange = useCallback(
    (_: React.SyntheticEvent, newInputValue: string) => {
      if (newInputValue.length > 0) {
        dispatch(
          searchActorsThunk({
            filters: { name: { op: 'ilike', val: `%${newInputValue}%` } },
          })
        );
      }
    },
    [dispatch]
  );

  const handleActorBlur = useCallback(() => {
    setTouched('actor_ids');
  }, [setTouched]);

  const handleProducerChange = useCallback(
    (_: React.SyntheticEvent, newValue: Producer | null) => {
      updateField('producer_id', newValue?.id || null);
    },
    [updateField]
  );

  const handleProducerInputChange = useCallback(
    (_: React.SyntheticEvent, newInputValue: string) => {
      if (newInputValue.length > 0) {
        dispatch(
          searchProducersThunk({
            filters: { name: { op: 'ilike', val: `%${newInputValue}%` } },
          })
        );
      }
    },
    [dispatch]
  );

  const handleProducerBlur = useCallback(() => {
    setTouched('producer_id');
  }, [setTouched]);

  const handlePlotChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateField('plot', e.target.value);
    },
    [updateField]
  );

  const handlePlotBlur = useCallback(() => {
    setTouched('plot');
  }, [setTouched]);

  const handlePosterFileChange = useCallback(
    (file: File | File[] | null) => {
      updateField('posterFile', file);
      // Only clear existing poster URL if we're uploading a new file
      if (file) {
        updateField('poster', '');
      }
      setTouched('posterFile');
    },
    [updateField, setTouched]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const success = await submitForm();
      if (success) {
        setResetKey((prev) => prev + 1);
        onSuccess?.(movieId);
      }
    },
    [submitForm, onSuccess, movieId]
  );

  const handleReset = useCallback(() => {
    reset();
    setResetKey((prev) => prev + 1);
    onCancel?.();
  }, [reset, onCancel]);

  const selectedProducer = useMemo(
    () => producerOptions.find((p) => p.id === formData.producer_id) || null,
    [producerOptions, formData.producer_id]
  );

  const selectedActors = useMemo(
    () => actorOptions.filter((actor) => formData.actor_ids.includes(actor.id)),
    [actorOptions, formData.actor_ids]
  );

  const handleCloseCreateProducerModal = useCallback(() => {
    dispatch(closeCreateProducerModal());
  }, [dispatch]);

  const handleOpenCreateActorModal = useCallback(() => {
    dispatch(openCreateActorModal());
  }, [dispatch]);

  const handleCloseCreateActorModal = useCallback(() => {
    dispatch(closeCreateActorModal());
  }, [dispatch]);

  const handleOpenCreateProducerModal = useCallback(() => {
    dispatch(openCreateProducerModal());
  }, [dispatch]);

  const submitButtonText = mode === 'create' ? 'Create Movie' : 'Update Movie';
  const resetButtonText = mode === 'create' ? 'Reset' : 'Cancel';

  return (
    <>
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

        <FormSearch
          label="Producer"
          value={selectedProducer}
          buttonLabel="Create New Producer"
          placeholder="Search for producer..."
          options={producerOptions}
          selected={selectedProducer}
          onChange={handleProducerChange}
          onInputChange={handleProducerInputChange}
          onBlur={handleProducerBlur}
          loading={producerLoading}
          disabled={false}
          touched={touched.producer_id}
          error={touched.producer_id ? formErrors.producer_id : ''}
          getOptionLabel={getPersonOptionLabel}
          isOptionEqualToValue={isPersonOptionEqualToValue}
          onButtonClick={handleOpenCreateProducerModal}
          size="small"
          required
        />

        <FormSearch
          multiple
          label="Actors"
          buttonLabel="Create New Actor"
          placeholder="Search for actors..."
          options={actorOptions}
          value={selectedActors}
          onChange={handleActorChange}
          onInputChange={handleActorInputChange}
          onBlur={handleActorBlur}
          loading={actorLoading}
          disabled={false}
          touched={touched.actor_ids}
          error={touched.actor_ids ? formErrors.actor_ids : ''}
          getOptionLabel={getPersonOptionLabel}
          isOptionEqualToValue={isPersonOptionEqualToValue}
          onButtonClick={handleOpenCreateActorModal}
          size="small"
          required
        />

        <FormInput
          fullWidth
          multiline
          rows={4}
          label="Plot"
          value={formData.plot}
          onChange={handlePlotChange}
          onBlur={handlePlotBlur}
          error={touched.plot && Boolean(formErrors.plot)}
          helperText={touched.plot ? formErrors.plot : ''}
          required
          disabled={isLoading}
          placeholder="Enter movie plot..."
        />

        <FileUpload
          key={`${resetKey}-${mode}`}
          label="Poster Image"
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
          allowedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
          required={mode === 'create'} // Only required for create mode
          disabled={isLoading}
          error={touched.posterFile && Boolean(formErrors.poster)}
          helperText={
            touched.posterFile ? formErrors.poster : 
            mode === 'create' ? 'Upload a poster image for the movie' :
            'Upload a new image to replace the current poster'
          }
          value={formData.posterFile}
          preview={formData.poster || null} // Show existing poster in edit mode
          showPreview={true}
          variant="dropzone"
          placeholder="Upload File"
          onChange={handlePosterFileChange}
        />

        <Box sx={STYLES.actions}>
          <Button variant="outlined" type="button" size="small" onClick={handleReset}>
            {resetButtonText}
          </Button>
          <Button
            variant="contained"
            type="submit"
            size="small"
            disabled={!isValid || isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
          >
            {isLoading ? `${mode === 'create' ? 'Creating' : 'Updating'}...` : submitButtonText}
          </Button>
        </Box>
      </Box>

      <CreatePersonForm open={modals.createProducer} type="producer" onClose={handleCloseCreateProducerModal} />
      <CreatePersonForm open={modals.createActor} type="actor" onClose={handleCloseCreateActorModal} />
    </>
  );
};

export default memo(MovieForm);