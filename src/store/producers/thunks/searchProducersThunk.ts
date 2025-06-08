import { createAsyncThunk } from '@reduxjs/toolkit';
import { searchProducers } from '../../../apis/producers/searchProducers';
import type { PostgrestError } from '@supabase/supabase-js';
import type { Filters } from '../../../apis/types';

interface SearchProducersPayload {
  filters?: Filters;
  select?: string;
}

const searchProducersThunk = createAsyncThunk(
  'producers/searchProducers',
  async (payload: SearchProducersPayload, { rejectWithValue }) => {
    try {
      const { data } = await searchProducers(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err as PostgrestError | Error);
    }
  }
);

export default searchProducersThunk;
