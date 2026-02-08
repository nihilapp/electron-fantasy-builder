import { computed, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import type { ListResponseType } from '@app-types/response.types';
import type { CoreRuleListItemVo } from '@app-types/vo.types';
import { useGet } from '~/composables/query/base/useGet';
import type { ListParams } from '~/types/electron';

/**
 * 주요 설정 목록 조회 훅. queryKey ['core-rules', prjNo], staleTime 60s.
 * CoreRulesSection·CoreRuleFormSection에서 동일 키로 캐시 공유.
 *
 * @param args - prjNo(반응형 가능), params(선택), enabled(선택, 기본 prjNo != null)
 */
export function useGetCoreRuleList(args: {
  prjNo: MaybeRefOrGetter<number | null>;
  params?: ListParams;
  enabled?: MaybeRefOrGetter<boolean>;
}) {
  return useGet<ListResponseType<CoreRuleListItemVo>>({
    queryKey: computed(() => [ 'core-rules', toValue(args.prjNo), ]),
    queryFn: () => {
      const prjNo = toValue(args.prjNo);

      if (prjNo == null) {
        return Promise.reject(new Error('prjNo is required'));
      }

      return window.electron.api.getCoreRuleList(prjNo, args.params ?? { page: 1, pageSize: 100, });
    },
    enabled: computed(() => {
      const base = toValue(args.prjNo) != null;

      if (args.enabled !== undefined) {
        return base && toValue(args.enabled);
      }

      return base;
    }),
    staleTime: 60_000,
  });
}
