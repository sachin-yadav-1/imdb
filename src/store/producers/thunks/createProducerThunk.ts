import { createAsyncThunk } from '@reduxjs/toolkit';
import type { PostgrestError } from '@supabase/supabase-js';
import { createProducer } from '../../../apis/producers/createProducer';
import { setToast } from '../../common/slices';

interface CreateProducerPayload {
  name: string;
  bio?: string;
  dob?: string;
  gender?: string;
}

const createProducerThunk = createAsyncThunk(
  'producers/createProducer',
  async (data: CreateProducerPayload, { rejectWithValue, dispatch }) => {
    try {
      const { data: newProducer } = await createProducer(data);

      dispatch(
        setToast({
          show: true,
          message: 'Producer created successfully',
          duration: 3000,
          type: 'success',
        })
      );

      return newProducer;
    } catch (error) {
      dispatch(
        setToast({
          show: true,
          message: 'Failed to create producer',
          duration: 3000,
          type: 'error',
        })
      );
      return rejectWithValue(error as PostgrestError | Error);
    }
  }
);

export default createProducerThunk;
