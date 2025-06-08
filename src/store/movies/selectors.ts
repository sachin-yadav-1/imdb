import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../types';

const selectActorsState = (state: RootState) => state.actors;
const selectProducersState = (state: RootState) => state.producers;
const selectCommonState = (state: RootState) => state.common;
const selectMoviesState = (state: RootState) => state.movies;

export const selectActorOptions = createSelector([selectActorsState], (actorsState) => actorsState.searchResults || []);

export const selectActorLoading = createSelector([selectActorsState], (actorsState) => actorsState.loading.search);

export const selectActorEntities = createSelector([selectActorsState], (actorsState) => actorsState.entities);

export const selectProducerOptions = createSelector(
  [selectProducersState],
  (producersState) => producersState.searchResults || []
);

export const selectProducerLoading = createSelector(
  [selectProducersState],
  (producersState) => producersState.loading.search
);

export const selectProducerEntities = createSelector(
  [selectProducersState],
  (producersState) => producersState.entities
);

export const selectModals = createSelector([selectCommonState], (commonState) => commonState.modal);

export const selectMovieEntities = createSelector([selectMoviesState], (moviesState) => moviesState.entities);

export const selectMovieFormData = createSelector(
  [selectActorOptions, selectActorLoading, selectProducerOptions, selectProducerLoading, selectModals],
  (actorOptions, actorLoading, producerOptions, producerLoading, modals) => ({
    actorOptions,
    actorLoading,
    producerOptions,
    producerLoading,
    modals,
  })
);

export const selectMovieById = createSelector(
  [selectMovieEntities, (_: RootState, movieId: number) => movieId],
  (entities, movieId) => entities[movieId] || null
);
