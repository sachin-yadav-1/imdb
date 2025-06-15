import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CreatePersonFormState, FormFieldType } from '../../../common/types';
import { PERSON_FORM_VALIDATIONS } from '../../../common/utils/validations';
import { actorsInitialState, personFormInitialState } from '../constants';
import createActorThunk from '../thunks/createActorThunk';
import searchActorsThunk from '../thunks/searchActorsThunk';
import type { Actor } from '../types';

const actorsSlice = createSlice({
  name: 'actors',
  initialState: actorsInitialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
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

    updateFormData(
      state,
      action: PayloadAction<{
        key: keyof CreatePersonFormState;
        value: any | any[];
        type?: FormFieldType;
      }>
    ) {
      const { key, value, type = 'none' } = action.payload;

      if (!key) return;

      if (type === 'select') {
        state.createForm[key].selected = value;
      } else {
        state.createForm[key].value = value as unknown as any;
      }

      if (state.createForm[key].error) {
        state.createForm[key].error = actorsInitialState.createForm[key].error;
      }
    },

    validateFormField(state, action: PayloadAction<{ key: keyof CreatePersonFormState }>) {
      const { key } = action.payload;
      if (!key) return;

      const validator = PERSON_FORM_VALIDATIONS[key].validate;
      const { valid, error } = validator(state.createForm[key]);
      if (!valid) {
        state.createForm[key].error = error;
      }
    },

    resetActorForm(state) {
      state.createForm = actorsInitialState.createForm;
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

export const { clearSearchResults, updateFormData, validateFormField, updateActorsFromMovie, resetActorForm } =
  actorsSlice.actions;
export default actorsSlice.reducer;
