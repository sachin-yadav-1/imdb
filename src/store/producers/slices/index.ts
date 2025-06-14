import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { personFormInitialState, PRODUCER_FORM_VALIDATIONS, producersInitialState } from '../constants';
import createProducerThunk from '../thunks/createProducerThunk';
import searchProducersThunk from '../thunks/searchProducersThunk';
import type { CreateProducerFormState, FormFieldType, Producer } from '../types';

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
    updateFormData(
      state,
      action: PayloadAction<{
        key: keyof CreateProducerFormState;
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
        state.createForm[key].error = producersInitialState.createForm[key].error;
      }
    },

    validateFormField(state, action: PayloadAction<{ key: keyof CreateProducerFormState }>) {
      const { key } = action.payload;
      if (!key) return;

      const validator = PRODUCER_FORM_VALIDATIONS[key].validate;
      const { valid, error } = validator(state.createForm[key]);
      if (!valid) {
        state.createForm[key].error = error;
      }
    },

    resetProducerForm(state) {
      state.createForm = producersInitialState.createForm;
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

export const { clearSearchResults, clearErrors, validateFormField, updateFormData, resetProducerForm } =
  producersSlice.actions;
export default producersSlice.reducer;
