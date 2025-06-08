import { createAsyncThunk } from '@reduxjs/toolkit';
import { searchActors } from '../../../apis/actors/searchActors';
import type { Filters } from '../../../apis/types';

interface SearchActorsPayload {
  filters?: Filters;
  select?: string;
}

const searchActorsThunk = createAsyncThunk(
  'actors/searchActors',
  async (payload: SearchActorsPayload, { rejectWithValue }) => {
    try {
      const { data } = await searchActors(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export default searchActorsThunk;
