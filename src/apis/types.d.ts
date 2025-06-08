export interface ApiResponse<T> {
  data: T[] | null;
  error: string | null;
  success: boolean;
}

export interface ApiSingleResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface Pagination {
  total: number;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}
export interface ApiPaginatedResponse<T> {
  success: boolean;
  error: string | null;
  data: {
    movies: QueryResult<T>;
    pagination: Pagination;
  };
}
