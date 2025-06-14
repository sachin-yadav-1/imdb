import type { Filters } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const applyFilters = (query: any, filters: Filters = {}): any => {
  if (filters && Object.keys(filters).length > 0) {
    for (const key in filters) {
      const { op, val } = filters[key];

      if (op === 'ilike') {
        query = query.ilike(key, `*${val}*` as string);
      } else if (op === 'in') {
        query = query.in(key, val as number[] | string[]);
      } else if (op === 'eq') {
        query = query.eq(key, val);
      } else {
        query = query.eq(key, val);
      }
    }
  }

  return query;
};
