import { createSlice } from '@reduxjs/toolkit';
import { commonInitialState } from '../constants';

const commonSlice = createSlice({
  name: 'common',
  initialState: commonInitialState,
  reducers: {
    setToast: (state, action) => {
      state.toast = action.payload;
    },
    resetToast: (state) => {
      state.toast = commonInitialState.toast;
    },
    setModal: (state, action) => {
      state.modal = { ...state.modal, ...action.payload };
    },
    openCreateActorModal: (state) => {
      state.modal.createActor = true;
    },
    closeCreateActorModal: (state) => {
      state.modal.createActor = false;
    },
    openCreateProducerModal: (state) => {
      state.modal.createProducer = true;
    },
    closeCreateProducerModal: (state) => {
      state.modal.createProducer = false;
    },
  },
});

export const { setToast, resetToast, setModal, openCreateActorModal, closeCreateActorModal, openCreateProducerModal, closeCreateProducerModal } = commonSlice.actions;
export default commonSlice.reducer;
