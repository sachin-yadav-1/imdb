import { configureStore } from '@reduxjs/toolkit';
import actorsReducer from './actors/slices';
import commonReducer from './common/slices';
import moviesReducer from './movies/slices';
import producersReducer from './producers/slices';
import authReducer from './auth/slices';

const store = configureStore({
  reducer: {
    auth: authReducer,
    actors: actorsReducer,
    movies: moviesReducer,
    producers: producersReducer,
    common: commonReducer,
  },
});

export default store;
