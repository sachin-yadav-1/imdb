export const BUCKETS = {
  POSTERS: 'posters',
};

export const TABLES = {
  ACTORS: 'actors',
  ACTOR_MOVIE: 'actor_movie',
  MOVIES: 'movies',
  PRODUCERS: 'producers',
};

export const DEFAULT_SELECTS = {
  MOVIES: {
    SELF: `*`,
    WITH_ACTORS: `
      actor_movie (
        actors (
        id,
        name,
        gender,
        dob,
        bio
        )
      )
    `,
    WITH_PRODUCERS: `
      producer_id (
        id,
        name
      )
    `,
  },
};
