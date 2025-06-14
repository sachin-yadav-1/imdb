import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { FORM_FIELD_VALIDATIONS, movieFormInitialState, moviesInitialState } from '../constants';
import { fetchMoviesPaginatedThunk } from '../thunks/fetchPaginatedMoviesThunk';
import type { FormFieldType, Movie, MovieFormState } from '../types';

const moviesSlice = createSlice({
  name: 'movies',
  initialState: moviesInitialState,
  reducers: {
    clearErrors: (state) => {
      state.error = moviesInitialState.error;
    },
    updateFormData(
      state,
      action: PayloadAction<{ key: keyof MovieFormState; value: any | any[]; type?: FormFieldType }>
    ) {
      const { key, value, type = 'none' } = action.payload;

      if (!key) return;

      if (type === 'select' || type === 'multi-select') {
        state.createForm[key].selected = value;
      } else {
        state.createForm[key].value = value as unknown as any;
      }
      if (state.createForm[key].error) {
        state.createForm[key].error = movieFormInitialState[key].error;
      }
    },
    updateProducerSelection(state, action: PayloadAction<{ value: number }>) {
      const { value } = action.payload;
      state.createForm.producer.selected = value;
    },

    validateFormField(state, action: PayloadAction<{ key: keyof MovieFormState }>) {
      const { key } = action.payload;
      if (!key) return;

      const validator = FORM_FIELD_VALIDATIONS[key].validate;
      const { valid, error } = validator(state.createForm[key]);
      if (!valid) {
        state.createForm[key].error = error;
      }
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
  },
});

export const { clearErrors, updateFormData, validateFormField } = moviesSlice.actions;
export default moviesSlice.reducer;
