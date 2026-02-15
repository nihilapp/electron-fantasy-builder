import type { QueryKey } from '@tanstack/vue-query';

import { useDelete } from '~/composables/query/base/useDelete';

/**
 * @description 지역 삭제 훅. 성공 시 ['regions', prjNo], ['region', prjNo, regionNo] 무효화.
 */
export function useDeleteRegion() {
  return useDelete<
    Awaited<ReturnType<typeof window.electron.api.deleteRegion>>,
    { prjNo: number; regionNo: number }
  >({
    mutationFn: ({ prjNo, regionNo, }) =>
      window.electron.api.deleteRegion(prjNo, regionNo),
    invalidateKeys: ({ prjNo, regionNo, }) => [
      [ 'regions', prjNo, ] as QueryKey,
      [ 'region', prjNo, regionNo, ] as QueryKey,
    ],
  });
}
