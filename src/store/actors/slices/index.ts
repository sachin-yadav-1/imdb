import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { actorsInitialState, personFormInitialState } from '../constants';
import { validatePersonForm } from '../helpers/validatePersonForm';
import createActorThunk from '../thunks/createActorThunk';
import searchActorsThunk from '../thunks/searchActorsThunk';
import type { Actor, PersonFormData } from '../types';

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

    // CREATE FORM ACTIONS
    updateCreateFormField: (state, action: PayloadAction<{ field: keyof PersonFormData; value: any }>) => {
      const { field, value } = action.payload;
      state.createForm.data[field] = value as never;
      state.createForm.touched[field] = true;
      state.createForm.isDirty = true;

      const errors = validatePersonForm(state.createForm.data, 'actor');
      state.createForm.errors = errors;
      state.createForm.isValid = Object.keys(errors).length === 0;
    },

    setCreateFormTouched: (state, action: PayloadAction<keyof PersonFormData>) => {
      state.createForm.touched[action.payload] = true;
      const errors = validatePersonForm(state.createForm.data, 'actor');
      state.createForm.errors = errors;
    },

    validateCreateForm: (state) => {
      const errors = validatePersonForm(state.createForm.data, 'actor');
      state.createForm.errors = errors;
      state.createForm.isValid = Object.keys(errors).length === 0;

      Object.keys(state.createForm.touched).forEach((field) => {
        state.createForm.touched[field as keyof PersonFormData] = true;
      });
    },

    resetCreateForm: (state) => {
      state.createForm = { ...personFormInitialState };
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

    // CREATE ACTOR
    builder.addCase(createActorThunk.pending, (state) => {
      state.loading.create = true;
      state.error.create = null;
    });
    builder.addCase(createActorThunk.fulfilled, (state, action) => {
      console.log('createActorThunk.fulfilled', action.payload);
      state.loading.create = false;
      const actor = action.payload as unknown as Actor;

      state.entities[actor.id] = actor;
      state.ids.push(actor.id);

      const existsInSearch = state.searchResults.find((a) => a.id === actor.id);
      if (!existsInSearch) {
        state.searchResults.unshift(actor);
      }

      state.createForm = { ...personFormInitialState };
    });
    builder.addCase(createActorThunk.rejected, (state, action) => {
      state.loading.create = false;
      state.error.create = action.payload as string;
    });
  },
});

export const {
  clearSearchResults,
  clearErrors,
  updateActorsFromMovie,
  updateCreateFormField,
  setCreateFormTouched,
  validateCreateForm,
  resetCreateForm,
} = actorsSlice.actions;
export default actorsSlice.reducer;
