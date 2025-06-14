import { Box, CircularProgress } from '@mui/material';
import { createSelector } from '@reduxjs/toolkit';
import { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import searchActorsThunk from '../../../store/actors/thunks/searchActorsThunk';
import type { Actor } from '../../../store/actors/types';
import { useAppDispatch } from '../../../store/hooks';
import { resetForm, updateFormData, validateFormField } from '../../../store/movies/slices';
import { createMovieThunk } from '../../../store/movies/thunks/createMovieThunk';
import type { FormFieldType, MovieFormState } from '../../../store/movies/types';
import searchProducersThunk from '../../../store/producers/thunks/searchProducersThunk';
import type { RootState } from '../../../store/types';
import Button from '../../atoms/Button';
import FormField from '../../molecules/FormField';
import SearchInput from '../SearchInput/SearchInput';
import useNavigation from '../../../common/hooks/useNavigation';
import CreateActorForm from '../CreateActorForm';
import {
  closeCreateActorModal,
  closeCreateProducerModal,
  openCreateActorModal,
  openCreateProducerModal,
} from '../../../store/common/slices';
import { resetActorForm } from '../../../store/actors/slices';
import CreateProducerForm from '../CreateProducerForm';
import { resetProducerForm } from '../../../store/producers/slices';

const STYLES = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    padding: '2rem 0',
  },
  searchRoot: {
    width: '100%',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '1rem',
  },
};

const DEFAULT_ARR: any[] = [];

const selectFormData = createSelector(
  (state: RootState) => state.movies.createForm,
  (form) => ({
    name: form.name.value || '',
    nameError: form.name.error || '',
    plot: form.plot.value || '',
    plotError: form.plot.error || '',
    producer: form.producer.value || '',
    selectedProducer: form.producer.selected || null,
    producerError: form.producer.error || '',
    actor: form.actors.value || '',
    selectedActors: form.actors.selected || DEFAULT_ARR,
    actorsError: form.actors.error || '',
    releaseDate: form.release_date.value || '',
    releaseDateError: form.release_date.error || '',
  })
);

interface CustomEvent {
  target: { name: string; value: string; dataset?: { type?: string } };
}
const CreateMovieForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { navigate } = useNavigation();
  const formData = useSelector(selectFormData);
  const producerOptions = useSelector((state: RootState) => state.producers.searchResults) || DEFAULT_ARR;
  const actorOptions = useSelector((state: RootState) => state.actors.searchResults) || DEFAULT_ARR;
  const createMovieLoading = useSelector((state: RootState) => state.movies.loading.create) || false;
  const createActorOpen = useSelector((state: RootState) => state.common.modal.createActor) || false;
  const createProducerOpen = useSelector((state: RootState) => state.common.modal.createProducer) || false;

  const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | CustomEvent) => {
    const key = e.target.name as keyof MovieFormState;
    const type: FormFieldType = (e.target.dataset!.type as FormFieldType) || 'none';
    const value = e.target.value || '';
    dispatch(updateFormData({ key, value, type }));
  }, []);

  const handleFieldBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof MovieFormState;
    dispatch(validateFormField({ key }));
  }, []);

  const handleProducerSearch = useCallback(
    (value: string) => {
      dispatch(searchProducersThunk({ filters: { name: { op: 'ilike', val: value } } }));
    },
    [handleFieldChange]
  );

  const handleActorSearch = useCallback(
    (value: string) => {
      dispatch(searchActorsThunk({ filters: { name: { op: 'ilike', val: value } } }));
    },
    [handleFieldChange]
  );

  const handleProducerSelection = useCallback(
    (name: unknown, value: any) => {
      const syntheticEvent = {
        target: { name, value: value, dataset: { type: 'select' } },
      } as React.ChangeEvent<HTMLInputElement> | CustomEvent;

      handleFieldChange(syntheticEvent);
    },
    [handleFieldChange]
  );

  const handleActorSelection = useCallback(
    (name: unknown, value: any) => {
      const syntheticEvent = {
        target: { name, value: value, dataset: { type: 'multi-select' } },
      } as React.ChangeEvent<HTMLInputElement> | CustomEvent;

      handleFieldChange(syntheticEvent);
    },
    [handleFieldChange]
  );

  const onInputValueChange = useCallback((inputValue: string, name: string) => {
    handleFieldChange({ target: { value: inputValue, name, dataset: { type: 'none' } } });
  }, []);

  const handleCreateMovie = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const createMoviePayload = {
        name: formData.name,
        plot: formData.plot,
        poster: '',
        release_date: formData.releaseDate,
        producer_id: formData.selectedProducer.id,
        actor_ids: formData.selectedActors.map((a: Actor) => a.id),
      };

      dispatch(createMovieThunk(createMoviePayload as any));

      const result = await dispatch(createMovieThunk(createMoviePayload as any));

      const success = createMovieThunk.fulfilled.match(result);
      if (success) {
        dispatch(resetForm({ formTypeKey: 'createForm' }));
        navigate('/');
      }
    },
    [formData]
  );

  const handleCancel = useCallback(() => {
    dispatch(resetForm({ formTypeKey: 'createForm' }));
    navigate('/');
  }, []);

  const handleCloseActorModal = useCallback(() => {
    dispatch(resetActorForm());
    dispatch(closeCreateActorModal());
  }, []);

  const handleCreateNewActorModalClick = useCallback(() => {
    dispatch(openCreateActorModal());
  }, []);

  const handleCloseProducerModal = useCallback(() => {
    dispatch(resetProducerForm());
    dispatch(closeCreateProducerModal());
  }, []);

  const handleCreateNewProoducerModalClick = useCallback(() => {
    dispatch(openCreateProducerModal());
  }, []);

  return (
    <>
      <Box component="form" sx={STYLES.root} onSubmit={handleCreateMovie}>
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
          name="release_date"
          label="Release Date"
          required
          type="date"
          fullWidth
          value={formData.releaseDate}
          error={formData.releaseDateError}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />

        <FormField
          multiline
          rows={4}
          name="plot"
          label="Plot"
          required
          fullWidth
          value={formData.plot}
          error={formData.plotError}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />

        <SearchInput
          key="producer"
          name="producer"
          label="Producer"
          required
          createButtonText="Create New Producer"
          onCreateButtonClick={handleCreateNewProoducerModalClick}
          value={formData.selectedProducer}
          debounceTime={300}
          options={producerOptions}
          onChange={handleProducerSelection}
          onInputValueChange={onInputValueChange}
          onSearch={handleProducerSearch}
          getOptionLabel={(option) => option.name || ''}
        />

        <SearchInput
          multiple
          key="actors"
          name="actors"
          label="Actors"
          required
          createButtonText="Create New Actor"
          onCreateButtonClick={handleCreateNewActorModalClick}
          value={formData.selectedActors}
          debounceTime={300}
          options={actorOptions}
          onChange={handleActorSelection}
          onInputValueChange={onInputValueChange}
          onSearch={handleActorSearch}
          getOptionLabel={(option) => option.name || ''}
        />

        <Box sx={STYLES.formActions}>
          <Button
            type="button"
            variant="outlined"
            disableElevation
            disabled={createMovieLoading}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={createMovieLoading}
            startIcon={createMovieLoading ? <CircularProgress size={20} /> : null}
          >
            Create
          </Button>
        </Box>
      </Box>

      {createActorOpen && <CreateActorForm open={createActorOpen} onClose={handleCloseActorModal} />}
      {createProducerOpen && <CreateProducerForm open={createProducerOpen} onClose={handleCloseProducerModal} />}
    </>
  );
};

export default memo(CreateMovieForm);
