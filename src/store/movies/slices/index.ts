import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { movieFormInitialState, moviesInitialState } from '../constants';
import { validateMovieForm } from '../helpers/validateForm';
import { createMovieThunk } from '../thunks/createMovieThunk';
import { updateMovieThunk } from '../thunks/updateMovieThunk';
import { fetchMoviesPaginatedThunk } from '../thunks/fetchPaginatedMoviesThunk';
import { fetchSingleMovieThunk } from '../thunks/fetchSingleMovieThunk';
import type { Movie, MovieFormData } from '../types';

const moviesSlice = createSlice({
  name: 'movies',
  initialState: moviesInitialState,
  reducers: {
    clearErrors: (state) => {
      state.error = moviesInitialState.error;
    },

    updateFormField: (state, action: PayloadAction<{ field: keyof MovieFormData; value: any }>) => {
      const { field, value } = action.payload;
      state.form.data[field] = value as never;
      state.form.touched[field] = true;
      state.form.isDirty = true;

      const errors = validateMovieForm(state.form.data);
      state.form.errors = errors;
      state.form.isValid = Object.keys(errors).length === 0;
    },

    validateForm: (state) => {
      const errors = validateMovieForm(state.form.data);
      state.form.errors = errors;
      state.form.isValid = Object.keys(errors).length === 0;

      Object.keys(state.form.touched).forEach((field) => {
        state.form.touched[field as keyof MovieFormData] = true;
      });
    },

    setFormTouched: (state, action: PayloadAction<keyof MovieFormData>) => {
      state.form.touched[action.payload] = true;

      const errors = validateMovieForm(state.form.data);
      state.form.errors = errors;
      state.form.isValid = Object.keys(errors).length === 0;
    },

    resetForm: (state) => {
      state.form = {
        ...movieFormInitialState,
      };
    },

    populateFormForEdit: (state, action: PayloadAction<Movie>) => {
      const movie = action.payload;
      state.form.data = {
        name: movie.name,
        plot: movie.plot,
        release_date: movie.release_date,
        poster: movie.poster || '',
        producer_id: movie.producer?.id || null,
        actor_ids: movie.actor_ids || [],
        posterFile: null,
      };

      state.form.errors = {};
      state.form.touched = {
        name: false,
        plot: false,
        release_date: false,
        poster: false,
        producer_id: false,
        actor_ids: false,
        posterFile: false,
      };
      state.form.isValid = true;
      state.form.isDirty = false;
    },

    initializeFormForCreate: (state) => {
      state.form = { ...movieFormInitialState };
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
    builder.addCase(createMovieThunk.pending, (state) => {
      state.loading.create = true;
      state.error.create = null;
    });
    builder.addCase(createMovieThunk.fulfilled, (state, action) => {
      state.loading.create = false;
      state.error.create = null;

      const movie = action.payload as Movie;

      state.entities[movie.id] = movie;
      if (!state.ids.includes(movie.id)) {
        state.ids.push(movie.id);
      }

      state.form = {
        ...movieFormInitialState,
      };
    });
    builder.addCase(createMovieThunk.rejected, (state, action) => {
      state.loading.create = false;
      state.error.create = action.payload as Error;
    });

    // UPDATE MOVIE
    builder.addCase(updateMovieThunk.pending, (state) => {
      state.loading.update = true;
      state.error.update = null;
    });
    builder.addCase(updateMovieThunk.fulfilled, (state, action) => {
      state.loading.update = false;
      state.error.update = null;

      const movie = action.payload as Movie;
      state.entities[movie.id] = movie;

      state.form = {
        ...movieFormInitialState,
      };
    });
    builder.addCase(updateMovieThunk.rejected, (state, action) => {
      state.loading.update = false;
      state.error.update = action.payload as Error;
    });
  },
});

export const {
  clearErrors,
  updateFormField,
  setFormTouched,
  resetForm,
  validateForm,
  populateFormForEdit,
  initializeFormForCreate,
} = moviesSlice.actions;
export default moviesSlice.reducer;
