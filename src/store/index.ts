import { configureStore } from '@reduxjs/toolkit';
import actorsReducer from './actors/slices';
import commonReducer from './common/slices';
import moviesReducer from './movies/slices';
import producersReducer from './producers/slices';

const store = configureStore({
  reducer: {
    actors: actorsReducer,
    movies: moviesReducer,
    producers: producersReducer,
    common: commonReducer,
  },
});

export default store;
