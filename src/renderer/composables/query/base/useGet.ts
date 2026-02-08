import type { UseQueryOptions } from '@tanstack/vue-query';
import { useQuery } from '@tanstack/vue-query';

/**
 * useQuery 래퍼. queryKey, queryFn, enabled, staleTime 등을 객체로 받음.
 * 엔티티 훅(useGetCoreRuleList 등)은 이 베이스를 사용해 구현.
 */

export function useGet<TData = unknown>(options: UseQueryOptions<TData>) {
  return useQuery(options);
}
