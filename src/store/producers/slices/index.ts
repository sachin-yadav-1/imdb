import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { validatePersonForm } from '../../actors/helpers/validatePersonForm';
import type { PersonFormData } from '../../actors/types';
import { personFormInitialState, producersInitialState } from '../constants';
import createProducerThunk from '../thunks/createProducerThunk';
import searchProducersThunk from '../thunks/searchProducersThunk';
import type { Producer } from '../types';

const producersSlice = createSlice({
  name: 'producers',
  initialState: producersInitialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearErrors: (state) => {
      state.error = producersInitialState.error;
    },

    // CREATE FORM ACTIONS
    updateCreateFormField: (state, action: PayloadAction<{ field: keyof PersonFormData; value: any }>) => {
      const { field, value } = action.payload;
      state.createForm.data[field] = value as never;
      state.createForm.touched[field] = true;
      state.createForm.isDirty = true;

      const errors = validatePersonForm(state.createForm.data, 'producer');
      state.createForm.errors = errors;
      state.createForm.isValid = Object.keys(errors).length === 0;
    },

    setCreateFormTouched: (state, action: PayloadAction<keyof PersonFormData>) => {
      state.createForm.touched[action.payload] = true;
      const errors = validatePersonForm(state.createForm.data, 'producer');
      state.createForm.errors = errors;
    },

    validateCreateForm: (state) => {
      const errors = validatePersonForm(state.createForm.data, 'producer');
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
    // SEARCH PRODUCERS
    builder.addCase(searchProducersThunk.pending, (state) => {
      state.loading.search = true;
    });
    builder.addCase(searchProducersThunk.fulfilled, (state, action) => {
      state.loading.search = false;
      state.searchResults = action.payload as Producer[];
    });
    builder.addCase(searchProducersThunk.rejected, (state, action) => {
      state.loading.search = false;
      state.error.search = action.payload as string;
    });

    // CREATE PRODUCER
    builder.addCase(createProducerThunk.pending, (state) => {
      state.loading.create = true;
      state.error.create = null;
    });
    builder.addCase(createProducerThunk.fulfilled, (state, action) => {
      state.loading.create = false;
      const producer = action.payload as unknown as Producer;

      state.entities[producer.id] = producer;
      state.ids.push(producer.id);

      const existsInSearch = state.searchResults.find((p) => p.id === producer.id);
      if (!existsInSearch) {
        state.searchResults.unshift(producer);
      }

      state.createForm = { ...personFormInitialState };
    });
    builder.addCase(createProducerThunk.rejected, (state, action) => {
      state.loading.create = false;
      state.error.create = action.payload as string;
    });
  },
});

export const {
  clearSearchResults,
  clearErrors,
  updateCreateFormField,
  setCreateFormTouched,
  validateCreateForm,
  resetCreateForm,
} = producersSlice.actions;
export default producersSlice.reducer;
