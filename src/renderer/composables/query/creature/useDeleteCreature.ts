import type { QueryKey } from '@tanstack/vue-query';

import { useDelete } from '~/composables/query/base/useDelete';

/**
 * 종족/생물 삭제 훅. 성공 시 ['creatures', prjNo], ['creature', prjNo, creatureNo] 무효화.
 *
 * @returns useMutation 반환. mutate({ prjNo, creatureNo }) 호출.
 */
export function useDeleteCreature() {
  return useDelete<
    Awaited<ReturnType<typeof window.electron.api.deleteCreature>>,
    { prjNo: number; creatureNo: number }
  >({
    mutationFn: ({ prjNo, creatureNo, }) =>
      window.electron.api.deleteCreature(prjNo, creatureNo),
    invalidateKeys: ({ prjNo, creatureNo, }) => [
      [ 'creatures', prjNo, ] as QueryKey,
      [ 'creature', prjNo, creatureNo, ] as QueryKey,
    ],
  });
}
