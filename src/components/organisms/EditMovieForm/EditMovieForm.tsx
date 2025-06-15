import { Box, CircularProgress } from '@mui/material';
import { createSelector } from '@reduxjs/toolkit';
import { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import useNavigation from '../../../common/hooks/useNavigation';
import type { FormFieldType } from '../../../common/types';
import { resetActorForm } from '../../../store/actors/slices';
import searchActorsThunk from '../../../store/actors/thunks/searchActorsThunk';
import type { Actor } from '../../../store/actors/types';
import {
  closeCreateActorModal,
  closeCreateProducerModal,
  openCreateActorModal,
  openCreateProducerModal,
} from '../../../store/common/slices';
import { useAppDispatch } from '../../../store/hooks';
import { resetForm, updateFormData, validateForm, validateFormField } from '../../../store/movies/slices';
import { updateMovieThunk } from '../../../store/movies/thunks/updateMovieThunk';
import type { MovieFormState } from '../../../store/movies/types';
import { resetProducerForm } from '../../../store/producers/slices';
import searchProducersThunk from '../../../store/producers/thunks/searchProducersThunk';
import type { RootState } from '../../../store/types';
import Button from '../../atoms/Button';
import FileUploadField from '../../molecules/FileUploadField';
import FormField from '../../molecules/FormField';
import SearchInput from '../../molecules/SearchInput';
import CreateActorForm from '../CreateActorForm';
import CreateProducerForm from '../CreateProducerForm';

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
  (state: RootState) => state.movies.editForm,
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
    poster: form.poster.value || null,
    posterError: form.poster.error || '',
    isValid: form.isValid || false,
  })
);

interface CustomEvent {
  target: { name: string; value: string; dataset?: { type?: string } };
}
interface EditMovieProps {
  movieId: number | null;
}
const EditMovieForm: React.FC<EditMovieProps> = ({ movieId = null }) => {
  const dispatch = useAppDispatch();
  const { navigate } = useNavigation();
  const formData = useSelector(selectFormData);
  const producerOptions = useSelector((state: RootState) => state.producers.searchResults) || DEFAULT_ARR;
  const actorOptions = useSelector((state: RootState) => state.actors.searchResults) || DEFAULT_ARR;
  const updateMovieLoading = useSelector((state: RootState) => state.movies.loading.update) || false;
  const createActorOpen = useSelector((state: RootState) => state.common.modal.createActor) || false;
  const createProducerOpen = useSelector((state: RootState) => state.common.modal.createProducer) || false;

  const isFormValid = useMemo(() => {
    const hasRequiredFields = !!(
      (formData.name as string)?.trim() &&
      (formData.plot as string)?.trim() &&
      formData.releaseDate &&
      formData.selectedProducer?.id &&
      formData.selectedActors?.length > 0
    );

    const hasNoErrors = !(
      formData.nameError ||
      formData.plotError ||
      formData.releaseDateError ||
      formData.producerError ||
      formData.actorsError ||
      formData.posterError
    );

    return hasRequiredFields && hasNoErrors;
  }, [
    formData.name,
    formData.plot,
    formData.releaseDate,
    formData.selectedProducer,
    formData.selectedActors,
    formData.nameError,
    formData.plotError,
    formData.releaseDateError,
    formData.producerError,
    formData.actorsError,
    formData.posterError,
  ]);

  const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | CustomEvent) => {
    const key = e.target.name as keyof MovieFormState;
    const type: FormFieldType = (e.target.dataset!.type as FormFieldType) || 'none';
    const value = e.target.value || '';
    dispatch(updateFormData({ key, value, type, formTypeKey: 'editForm' }));
  }, []);

  const handleFieldBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof MovieFormState;
    dispatch(validateFormField({ key, formTypeKey: 'editForm' }));
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

  const handleUpdateMovie = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      dispatch(validateForm({ formTypeKey: 'editForm' }));

      if (!isFormValid) {
        return;
      }

      const updateMoviePayload = {
        name: formData.name,
        plot: formData.plot,
        poster: formData.poster,
        release_date: formData.releaseDate,
        producer_id: formData.selectedProducer.id,
        actor_ids: formData.selectedActors.map((a: Actor) => a.id),
      };

      const result = await dispatch(
        updateMovieThunk({
          id: movieId as number,
          data: updateMoviePayload as any,
        })
      );

      const success = updateMovieThunk.fulfilled.match(result);
      if (success) {
        dispatch(resetForm({ formTypeKey: 'editForm' }));
        navigate('/');
      }
    },
    [formData, isFormValid, movieId, dispatch, navigate]
  );

  const handleFileChange = useCallback(
    (file: File | null) => {
      dispatch(
        updateFormData({
          key: 'poster',
          value: file,
          type: 'file',
          formTypeKey: 'editForm',
        })
      );
    },
    [dispatch]
  );

  const handleFileBlur = useCallback(() => {
    dispatch(validateFormField({ key: 'poster', formTypeKey: 'editForm' }));
  }, [dispatch]);

  const handleCancel = useCallback(() => {
    dispatch(resetForm({ formTypeKey: 'editForm' }));
    navigate('/');
  }, [dispatch, navigate]);

  const handleCreateNewActorModalClick = useCallback(() => {
    dispatch(openCreateActorModal());
  }, [dispatch]);

  const handleCreateNewProducerModalClick = useCallback(() => {
    dispatch(openCreateProducerModal());
  }, [dispatch]);

  const handleCloseActorModal = useCallback(() => {
    dispatch(resetActorForm());
    dispatch(closeCreateActorModal());
  }, [dispatch]);

  const handleCloseProducerModal = useCallback(() => {
    dispatch(resetProducerForm());
    dispatch(closeCreateProducerModal());
  }, [dispatch]);

  return (
    <>
      <Box component="form" sx={STYLES.root} onSubmit={handleUpdateMovie}>
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
          onCreateButtonClick={handleCreateNewProducerModalClick}
          value={formData.selectedProducer}
          debounceTime={300}
          options={producerOptions}
          onChange={handleProducerSelection}
          onInputValueChange={onInputValueChange}
          onSearch={handleProducerSearch}
          getOptionLabel={(option) => option.name || ''}
          error={formData.producerError}
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
          error={formData.actorsError}
        />

        <FileUploadField
          name="poster"
          label="Movie Poster"
          value={formData.poster}
          error={formData.posterError}
          onChange={handleFileChange}
          onBlur={handleFileBlur}
          accept="image/*"
          disabled={updateMovieLoading}
        />

        <Box sx={STYLES.formActions}>
          <Button type="button" variant="outlined" disabled={updateMovieLoading} onClick={handleCancel}>
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={updateMovieLoading || !isFormValid}
            variant="contained"
            startIcon={updateMovieLoading ? <CircularProgress size={20} /> : null}
          >
            Update
          </Button>
        </Box>
      </Box>

      {createActorOpen && <CreateActorForm open={createActorOpen} onClose={handleCloseActorModal} />}
      {createProducerOpen && <CreateProducerForm open={createProducerOpen} onClose={handleCloseProducerModal} />}
    </>
  );
};

export default memo(EditMovieForm);
