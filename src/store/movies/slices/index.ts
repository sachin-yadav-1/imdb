import { createSlice } from '@reduxjs/toolkit';
import { moviesInitialState } from '../constants';
import { fetchMoviesPaginatedThunk } from '../thunks/fetchPaginatedMoviesThunk';
import type { Movie } from '../types';

const moviesSlice = createSlice({
  name: 'movies',
  initialState: moviesInitialState,
  reducers: {
    clearErrors: (state) => {
      state.error = moviesInitialState.error;
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

export default moviesSlice.reducer;
