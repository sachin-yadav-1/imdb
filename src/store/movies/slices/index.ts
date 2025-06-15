import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { FORM_FIELD_VALIDATIONS, movieFormInitialState, moviesInitialState } from '../constants';
import { createMovieThunk } from '../thunks/createMovieThunk';
import { fetchMoviesPaginatedThunk } from '../thunks/fetchPaginatedMoviesThunk';
import { fetchSingleMovieThunk } from '../thunks/fetchSingleMovieThunk';
import { updateMovieThunk } from '../thunks/updateMovieThunk';
import type { FormFieldType, Movie, MovieFormState } from '../types';

type FormTypeKey = 'createForm' | 'editForm';

const moviesSlice = createSlice({
  name: 'movies',
  initialState: moviesInitialState,
  reducers: {
    clearErrors: (state) => {
      state.error = moviesInitialState.error;
    },
    updateFormData(
      state,
      action: PayloadAction<{
        key: keyof MovieFormState;
        value: any | any[];
        type?: FormFieldType;
        formTypeKey?: FormTypeKey;
      }>
    ) {
      const { key, value, type = 'none', formTypeKey = 'createForm' } = action.payload;

      if (!key) return;

      if (type === 'select' || type === 'multi-select') {
        state[formTypeKey][key].selected = value;
      } else {
        state[formTypeKey][key].value = value as unknown as any;
      }
      if (state[formTypeKey][key].error) {
        state[formTypeKey][key].error = movieFormInitialState[key].error;
      }
    },
    updateProducerSelection(state, action: PayloadAction<{ value: number; formTypeKey?: FormTypeKey }>) {
      const { value, formTypeKey = 'createForm' } = action.payload;
      state[formTypeKey].producer.selected = value;
    },

    validateFormField(state, action: PayloadAction<{ key: keyof MovieFormState; formTypeKey?: FormTypeKey }>) {
      const { key, formTypeKey = 'createForm' } = action.payload;
      if (!key) return;

      const validator = FORM_FIELD_VALIDATIONS[key].validate;
      const { valid, error } = validator(state[formTypeKey][key]);
      if (!valid) {
        state[formTypeKey][key].error = error;
      }
    },

    validateForm(state, action: PayloadAction<{ formTypeKey?: FormTypeKey }>) {
      const { formTypeKey = 'createForm' } = action.payload;

      Object.keys(FORM_FIELD_VALIDATIONS).forEach((key) => {
        const fieldKey = key as keyof MovieFormState;
        const validator = FORM_FIELD_VALIDATIONS[fieldKey].validate;
        const { valid, error } = validator(state[formTypeKey][fieldKey]);
        if (!valid) {
          state[formTypeKey][fieldKey].error = error;
        } else {
          state[formTypeKey][fieldKey].error = '';
        }
      });

      const hasErrors = Object.keys(state[formTypeKey]).some((key) => {
        const fieldKey = key as keyof MovieFormState;
        return state[formTypeKey][fieldKey].error;
      });

      const hasRequiredFields = !!(
        state[formTypeKey].name.value?.toString().trim() &&
        state[formTypeKey].plot.value?.toString().trim() &&
        state[formTypeKey].release_date.value &&
        state[formTypeKey].producer.selected?.id &&
        state[formTypeKey].actors.selected?.length > 0
      );

      (state[formTypeKey] as any).isValid = hasRequiredFields && !hasErrors;
    },

    initializeEditMovieForm(state, action: PayloadAction<{ movie: MovieFormState }>) {
      const { movie } = action.payload;
      state.editForm = movie;
    },
    resetForm(state, action: PayloadAction<{ formTypeKey?: FormTypeKey }>) {
      const { formTypeKey = 'createForm' } = action.payload;
      state[formTypeKey] = moviesInitialState[formTypeKey];
    },
  },
  extraReducers: (builder) => {
    // FETCH PAGINATED MOVIES
    builder
      .addCase(fetchMoviesPaginatedThunk.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchMoviesPaginatedThunk.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = null;

        if (action.payload) {
          const { movies, pagination } = action.payload;

          state.pagination = pagination;

          const newEntities: Record<number, Movie> = {};
          const newIds: number[] = [];

          movies.forEach((movie: Movie) => {
            newEntities[movie.id] = movie;
            newIds.push(movie.id);
          });

          state.entities = newEntities;
          state.ids = newIds;
        }
      })
      .addCase(fetchMoviesPaginatedThunk.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload as Error;
      });

    // FETCH SINGLE MOVIE
    builder
      .addCase(fetchSingleMovieThunk.pending, (state) => {
        state.loading.fetchSingle = true;
        state.error.fetchSingle = null;
      })
      .addCase(fetchSingleMovieThunk.fulfilled, (state, action) => {
        state.loading.fetchSingle = false;
        state.error.fetchSingle = null;

        const movie = action.payload as Movie;
        state.entities[movie.id] = movie;

        if (!state.ids.includes(movie.id)) {
          state.ids.push(movie.id);
        }
      })
      .addCase(fetchSingleMovieThunk.rejected, (state, action) => {
        state.loading.fetchSingle = false;
        state.error.fetchSingle = action.payload as Error;
      });

    // CREATE MOVIE
    builder
      .addCase(createMovieThunk.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createMovieThunk.fulfilled, (state, action) => {
        state.loading.create = false;
        state.error.create = null;

        const movie = action.payload as Movie;

        state.entities[movie.id] = movie;
        if (!state.ids.includes(movie.id)) {
          state.ids.push(movie.id);
        }
      })
      .addCase(createMovieThunk.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload as Error;
      });

    // UPDATE MOVIE
    builder
      .addCase(updateMovieThunk.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateMovieThunk.fulfilled, (state, action) => {
        state.loading.update = false;
        state.error.update = null;

        const movie = action.payload as Movie;
        state.entities[movie.id] = movie;
      })
      .addCase(updateMovieThunk.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload as Error;
      });
  },
});

export const { clearErrors, updateFormData, validateFormField, validateForm, initializeEditMovieForm, resetForm } =
  moviesSlice.actions;
export default moviesSlice.reducer;
