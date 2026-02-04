import type { ListResponseType, ListType } from '@app-types/response.types';
import type { AbilityVo, ProjectAbilityVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import type { AbilitySearchQueryVo } from '@zod-schema/abilitySearch.schema';

import { AbilityMapper } from '../db/mapper/AbilityMapper';
import { ProjectAbilityMapper } from '../db/mapper/ProjectAbilityMapper';

/** 통합 검색 결과 항목: type 구분 + 어빌리티 필드 */
export type AbilitySearchItemVo = (AbilityVo | ProjectAbilityVo) & {
  type: 'GLOBAL' | 'PROJECT';
};

/**
 * 어빌리티 통합 검색.
 * 전역(abilities) + 프로젝트 종속(project_abilities) 풀을 type 필터로 통합 검색 후 페이징.
 */
export const AbilitySearchService = {
  async getSearch(
    prjNo: number,
    params: AbilitySearchQueryVo
  ): Promise<ListResponseType<AbilitySearchItemVo>> {
    const { type, searchKeyword, searchType, page: pageParam, pageSize: pageSizeParam, } = params;
    const page = pageParam ?? 1;
    const pageSize = pageSizeParam ?? 10;

    const searchParams = {
      searchKeyword: searchKeyword ?? null,
      searchType: searchType ?? null,
      page: null as number | null,
      pageSize: null as number | null,
    };

    const globalList: AbilitySearchItemVo[] = [];
    const projectList: AbilitySearchItemVo[] = [];

    if (type === 'GLOBAL' || type === 'ALL') {
      const { list, } = await AbilityMapper.selectList(searchParams as AbilityVo);
      list.forEach((item) => {
        globalList.push({ ...item, type: 'GLOBAL', });
      });
    }

    if (type === 'PROJECT' || type === 'ALL') {
      const { list, } = await ProjectAbilityMapper.selectList(
        prjNo,
        searchParams as ProjectAbilityVo
      );
      list.forEach((item) => {
        projectList.push({ ...item, type: 'PROJECT', });
      });
    }

    const merged = [ ...globalList, ...projectList, ];
    const abilityNm = (item: AbilitySearchItemVo) => (item.abilityNm ?? '').toString();
    merged.sort((itemA, itemB) => (
      abilityNm(itemA).localeCompare(abilityNm(itemB))
    ));

    const totalCnt = merged.length;
    const offset = (page - 1) * pageSize;
    const list = merged.slice(offset, offset + pageSize);
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<AbilitySearchItemVo> = {
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
  },
};
