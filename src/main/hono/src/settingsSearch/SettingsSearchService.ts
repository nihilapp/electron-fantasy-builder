import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { UnifiedSettingItemVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import {
  SETTING_CATEGORIES,
  SETTING_CATEGORY_LABELS,
  type SettingCategoryCode
} from '@zod-schema/settingsSearch.schema';

import { CharacterService } from './CharacterService';
import { CoreRuleService } from './CoreRuleService';
import { CreatureService } from './CreatureService';
import { EventService } from './EventService';
import { ItemService } from './ItemService';
import { LoreService } from './LoreService';
import { NationService } from './NationService';
import { OrganizationService } from './OrganizationService';
import { RegionService } from './RegionService';

/** 카테고리별 목록 조회 시 사용할 최대 개수 (통합 후 메모리 페이징). */
const PER_CATEGORY_LIMIT = 500;

type ListParams = {
  searchKeyword?: string | null;
  page: number;
  pageSize: number;
};

/**
 * @description 한 카테고리의 목록을 통합 검색 항목 배열로 변환.
 * @param category 카테고리 코드
 * @param list 해당 서비스 getList 응답의 list (Vo 배열)
 */
function mapListToUnified(
  category: SettingCategoryCode,
  list: Array<Record<string, unknown>>
): UnifiedSettingItemVo[] {
  const label = SETTING_CATEGORY_LABELS[category];

  const maps: Record<SettingCategoryCode, { noKey: string; nameKey: string }> = {
    CORE_RULE: { noKey: 'coreNo', nameKey: 'coreNm', },
    CREATURE: { noKey: 'creatureNo', nameKey: 'creatureNm', },
    CHARACTER: { noKey: 'charNo', nameKey: 'charNm', },
    REGION: { noKey: 'regionNo', nameKey: 'regionNm', },
    NATION: { noKey: 'ntnNo', nameKey: 'ntnNm', },
    ORGANIZATION: { noKey: 'orgNo', nameKey: 'orgNm', },
    ITEM: { noKey: 'itemNo', nameKey: 'itemNm', },
    EVENT: { noKey: 'eventNo', nameKey: 'eventNm', },
    LORE: { noKey: 'loreNo', nameKey: 'loreNm', },
  };

  const { noKey, nameKey, } = maps[category];

  return list
    .filter((row) => row[noKey] != null)
    .map((row) => ({
      settingCategory: category,
      settingNo: Number(row[noKey]),
      displayName: String(row[nameKey] ?? ''),
      categoryLabel: label,
    }));
}

/**
 * @description 전체 설정 통합 검색. 모든 설정 테이블을 조회해 하나의 목록으로 합친 뒤 페이징.
 * @param prjNo 프로젝트 번호
 * @param params q, categories(쉼표 구분), page, pageSize
 */
export async function searchUnified(
  prjNo: number,
  params: {
    q?: string | null;
    categories?: string | null;
    page?: number;
    pageSize?: number;
  }
): Promise<ListResponseType<UnifiedSettingItemVo>> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const keyword = params.q?.trim() || null;

  const requestedCategories: SettingCategoryCode[]
    = params.categories?.trim()
      ? (params.categories.split(',').map((c) => c.trim()).filter(Boolean) as SettingCategoryCode[])
      : [ ...SETTING_CATEGORIES, ];

  const validCategories = requestedCategories.filter((c) =>
    SETTING_CATEGORIES.includes(c)
  ) as SettingCategoryCode[];

  if (validCategories.length === 0) {
    const data: ListType<UnifiedSettingItemVo> = {
      list: [],
      totalCnt: 0,
      pageSize,
      page,
      totalPage: 1,
      isFirst: true,
      isLast: true,
    };
    return {
      data,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  }

  const listParams: ListParams = {
    searchKeyword: keyword,
    page: 1,
    pageSize: PER_CATEGORY_LIMIT,
  };

  const results: UnifiedSettingItemVo[] = [];

  const run = async (category: SettingCategoryCode): Promise<UnifiedSettingItemVo[]> => {
    const res = await (async (): Promise<ResponseType<unknown> | ListResponseType<unknown>> => {
      switch (category) {
        case 'CORE_RULE': {
          const body = await CoreRuleService.getList(prjNo, {
            ...listParams,
            prjNo,
          } as Parameters<typeof CoreRuleService.getList>[1]);
          return body as ListResponseType<unknown>;
        }
        case 'CREATURE': {
          const body = await CreatureService.getList(prjNo, {
            ...listParams,
            prjNo,
          } as Parameters<typeof CreatureService.getList>[1]);
          return body as ListResponseType<unknown>;
        }
        case 'CHARACTER': {
          const body = await CharacterService.getList(prjNo, {
            ...listParams,
            prjNo,
          } as Parameters<typeof CharacterService.getList>[1]);
          return body as ListResponseType<unknown>;
        }
        case 'REGION': {
          const body = await RegionService.getList(prjNo, {
            ...listParams,
            prjNo,
          } as Parameters<typeof RegionService.getList>[1]);
          return body as ListResponseType<unknown>;
        }
        case 'NATION': {
          const body = await NationService.getList(prjNo, {
            ...listParams,
            prjNo,
          } as Parameters<typeof NationService.getList>[1]);
          return body as ListResponseType<unknown>;
        }
        case 'ORGANIZATION': {
          const body = await OrganizationService.getList(prjNo, {
            ...listParams,
            prjNo,
          } as Parameters<typeof OrganizationService.getList>[1]);
          return body as ListResponseType<unknown>;
        }
        case 'ITEM': {
          const body = await ItemService.getList(prjNo, {
            ...listParams,
            prjNo,
          } as Parameters<typeof ItemService.getList>[1]);
          return body as ListResponseType<unknown>;
        }
        case 'EVENT': {
          const body = await EventService.getList(prjNo, {
            ...listParams,
            prjNo,
          } as Parameters<typeof EventService.getList>[1]);
          return body as ListResponseType<unknown>;
        }
        case 'LORE': {
          const body = await LoreService.getList(prjNo, {
            ...listParams,
            prjNo,
          } as Parameters<typeof LoreService.getList>[1]);
          return body as ListResponseType<unknown>;
        }
        default:
          return { data: { list: [], totalCnt: 0, pageSize: 0, page: 0, totalPage: 0, isFirst: true, isLast: true, }, error: false, code: RESPONSE_CODE.OK, message: '', };
      }
    })();

    if (res.error || !res.data) return [];
    const list = (res.data as ListType<unknown>).list ?? [];
    return mapListToUnified(category, list as Array<Record<string, unknown>>);
  };

  const chunks = await Promise.all(validCategories.map((c) => run(c)));
  for (const chunk of chunks) {
    results.push(...chunk);
  }

  results.sort((a, b) => {
    const catOrder = a.categoryLabel.localeCompare(b.categoryLabel, 'ko');
    if (catOrder !== 0) return catOrder;
    return (a.displayName ?? '').localeCompare(b.displayName ?? '', 'ko');
  });

  const totalCnt = results.length;
  const start = (page - 1) * pageSize;
  const list = results.slice(start, start + pageSize);
  const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

  const data: ListType<UnifiedSettingItemVo> = {
    list,
    totalCnt,
    pageSize,
    page,
    totalPage,
    isFirst: page <= 1,
    isLast: page >= totalPage,
  };

  return {
    data,
    error: false,
    code: RESPONSE_CODE.OK,
    message: '',
  };
}
