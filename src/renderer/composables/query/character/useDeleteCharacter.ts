import type { QueryKey } from '@tanstack/vue-query';

import { useDelete } from '~/composables/query/base/useDelete';

/**
 * @description 인물 삭제 훅. 성공 시 ['characters', prjNo], ['character', prjNo, charNo] 무효화.
 */
export function useDeleteCharacter() {
  return useDelete<
    Awaited<ReturnType<typeof window.electron.api.deleteCharacter>>,
    { prjNo: number; charNo: number }
  >({
    mutationFn: ({ prjNo, charNo, }) =>
      window.electron.api.deleteCharacter(prjNo, charNo),
    invalidateKeys: ({ prjNo, charNo, }) => [
      [ 'characters', prjNo, ] as QueryKey,
      [ 'character', prjNo, charNo, ] as QueryKey,
    ],
  });
}
