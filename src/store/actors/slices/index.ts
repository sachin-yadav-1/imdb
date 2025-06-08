import { createSlice } from '@reduxjs/toolkit';
import { actorsInitialState } from '../constants';
import type { Actor } from '../types';
import searchActorsThunk from '../thunks/searchActorsThunk';

const actorsSlice = createSlice({
  name: 'actors',
  initialState: actorsInitialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearErrors: (state) => {
      state.error = actorsInitialState.error;
    },
    updateActorsFromMovie: (state, action) => {
      action.payload.forEach((actor: Actor) => {
        if (!state.entities[actor.id]) {
          state.entities[actor.id] = actor;
          state.ids.push(actor.id);
        } else {
          state.entities[actor.id] = {
            ...state.entities[actor.id],
            ...actor,
          };
        }
      });
    },
  },

  extraReducers: (builder) => {
    // SEARCH ACTORS
    builder.addCase(searchActorsThunk.pending, (state) => {
      state.loading.search = true;
    });
    builder.addCase(searchActorsThunk.fulfilled, (state, action) => {
      state.loading.search = false;
      state.searchResults = action.payload as Actor[];
    });
    builder.addCase(searchActorsThunk.rejected, (state, action) => {
      state.loading.search = false;
      state.error.search = action.payload as string;
    });
  },
});

export const { clearSearchResults, clearErrors, updateActorsFromMovie } = actorsSlice.actions;
export default actorsSlice.reducer;
