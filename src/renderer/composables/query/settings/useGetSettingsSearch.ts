import { computed, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

import type { ListResponseType } from '@app-types/response.types';
import type { UnifiedSettingItemVo } from '@app-types/vo.types';
import { useGet } from '~/composables/query/base/useGet';

export interface SettingsSearchParams {
  q?: string;
  categories?: string;
  page?: number;
  pageSize?: number;
}

/**
 * 전체 설정 통합 검색 훅. queryKey ['settings-search', prjNo, q, categories, page].
 */
export function useGetSettingsSearch(args: {
  prjNo: MaybeRefOrGetter<number | null>;
  params?: MaybeRefOrGetter<SettingsSearchParams | undefined>;
  enabled?: MaybeRefOrGetter<boolean>;
}) {
  return useGet<ListResponseType<UnifiedSettingItemVo>>({
    queryKey: computed(() => [
      'settings-search',
      toValue(args.prjNo),
      toValue(args.params)?.q ?? '',
      toValue(args.params)?.categories ?? '',
      toValue(args.params)?.page ?? 1,
    ]),
    queryFn: () => {
      const prjNo = toValue(args.prjNo);
      if (prjNo == null) return Promise.reject(new Error('prjNo is required'));
      return window.electron.api.getSettingsSearch(prjNo, toValue(args.params));
    },
    enabled: computed(() => {
      const base = toValue(args.prjNo) != null;
      if (args.enabled !== undefined) return base && toValue(args.enabled);
      return base;
    }),
    staleTime: 30_000,
  });
}
