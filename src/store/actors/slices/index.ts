import { createSlice } from '@reduxjs/toolkit';
import { actorsInitialState } from '../constants';
import type { Actor } from '../types';

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
});

export const { clearSearchResults, clearErrors, updateActorsFromMovie } = actorsSlice.actions;
export default actorsSlice.reducer;
