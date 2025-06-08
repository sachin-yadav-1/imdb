import { createAsyncThunk } from '@reduxjs/toolkit';
import { createActor } from '../../../apis/actors/createActor';
import { setToast } from '../../common/slices';

export interface CreateActorPayload {
  name: string;
  bio?: string;
  dob?: string;
  gender?: string;
}

const createActorThunk = createAsyncThunk(
  'actors/createActor',
  async (data: CreateActorPayload, { rejectWithValue, dispatch }) => {
    try {
      const { data: newActor } = await createActor(data);

      dispatch(
        setToast({
          show: true,
          message: 'Actor created successfully',
          duration: 3000,
          type: 'success',
        })
      );

      return newActor;
    } catch (error) {
      dispatch(
        setToast({
          show: true,
          message: 'Failed to create actor',
          duration: 3000,
          type: 'error',
        })
      );
      return rejectWithValue(error);
    }
  }
);

export default createActorThunk;
