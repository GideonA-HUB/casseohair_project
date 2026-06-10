import type { PaginatedResponse } from '@/types';

/** Unwrap DRF list responses — handles both plain arrays and paginated objects. */
export function unwrapList<T>(data: T[] | PaginatedResponse<T> | unknown): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'results' in data) {
    return (data as PaginatedResponse<T>).results;
  }
  return [];
}
