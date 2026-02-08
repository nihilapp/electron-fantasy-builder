import type { QueryKey } from '@tanstack/vue-query';
import { useMutation, useQueryClient } from '@tanstack/vue-query';

/**
 * useMutation 래퍼 (DELETE). mutationFn, 성공 시 무효화할 queryKey 배열(또는 함수)을 객체로 받음.
 */

export interface UseDeleteOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** 성공 시 무효화할 queryKey 배열. 변수에 따라 키를 만들면 (variables) => QueryKey[] */
  invalidateKeys: QueryKey[] | ((variables: TVariables) => QueryKey[]);
}

/**
 * @description DELETE 계열 API를 useMutation으로 감싸고, onSuccess 시 invalidateKeys로 캐시 무효화.
 */
export function useDelete<TData, TVariables = unknown>(
  options: UseDeleteOptions<TData, TVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: options.mutationFn,
    onSuccess: (_data, variables) => {
      const keys = typeof options.invalidateKeys === 'function'
        ? options.invalidateKeys(variables)
        : options.invalidateKeys;

      for (const queryKey of keys) {
        queryClient.invalidateQueries({ queryKey, });
      }
    },
  });
}
