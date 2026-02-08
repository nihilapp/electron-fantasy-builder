import type { QueryKey } from '@tanstack/vue-query';

import { useDelete } from '~/composables/query/base/useDelete';

/**
 * 주요 설정 삭제 훅. 성공 시 ['core-rules', prjNo], ['core-rule', prjNo, coreNo] 무효화.
 *
 * @returns useMutation 반환. mutate({ prjNo, coreNo }) 호출.
 */
export function useDeleteCoreRule() {
  return useDelete<
    Awaited<ReturnType<typeof window.electron.api.deleteCoreRule>>,
    { prjNo: number; coreNo: number }
  >({
    mutationFn: ({ prjNo, coreNo, }) => window.electron.api.deleteCoreRule(prjNo, coreNo),
    invalidateKeys: ({ prjNo, coreNo, }) => [
      [ 'core-rules', prjNo, ] as QueryKey,
      [ 'core-rule', prjNo, coreNo, ] as QueryKey,
    ],
  });
}
