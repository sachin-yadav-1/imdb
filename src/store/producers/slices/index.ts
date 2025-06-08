import { createSlice } from '@reduxjs/toolkit';
import { producersInitialState } from '../constants';
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
  },
});

export const { clearSearchResults, clearErrors } = producersSlice.actions;
export default producersSlice.reducer;
