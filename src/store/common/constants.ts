import type { CommonInitialState } from './types';

export const commonInitialState: CommonInitialState = {
  toast: {
    show: false,
    message: '',
    duration: 3000,
    type: 'success',
  },
};
