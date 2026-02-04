import type { ListResponseType, ListType } from '@app-types/response.types';
import type { ProjectTraitVo, TraitVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import type { TraitSearchQueryVo } from '@zod-schema/traitSearch.schema';

import { ProjectTraitMapper } from '../db/mapper/ProjectTraitMapper';
import { TraitMapper } from '../db/mapper/TraitMapper';

/** 통합 검색 결과 항목: type 구분 + 특성 필드 */
export type TraitSearchItemVo = (TraitVo | ProjectTraitVo) & {
  type: 'GLOBAL' | 'PROJECT';
};

/**
 * 특성 통합 검색.
 * 전역(traits) + 프로젝트 종속(project_traits) 풀을 type 필터로 통합 검색 후 페이징.
 */
export const TraitSearchService = {
  async getSearch(
    prjNo: number,
    params: TraitSearchQueryVo
  ): Promise<ListResponseType<TraitSearchItemVo>> {
    const { type, searchKeyword, searchType, page: pageParam, pageSize: pageSizeParam, } = params;
    const page = pageParam ?? 1;
    const pageSize = pageSizeParam ?? 10;

    const searchParams = {
      searchKeyword: searchKeyword ?? null,
      searchType: searchType ?? null,
      page: null as number | null,
      pageSize: null as number | null,
    };

    const globalList: TraitSearchItemVo[] = [];
    const projectList: TraitSearchItemVo[] = [];

    if (type === 'GLOBAL' || type === 'ALL') {
      const { list, } = await TraitMapper.selectList(searchParams as TraitVo);
      list.forEach((item) => {
        globalList.push({ ...item, type: 'GLOBAL', });
      });
    }

    if (type === 'PROJECT' || type === 'ALL') {
      const { list, } = await ProjectTraitMapper.selectList(
        prjNo,
        searchParams as ProjectTraitVo
      );
      list.forEach((item) => {
        projectList.push({ ...item, type: 'PROJECT', });
      });
    }

    const merged = [ ...globalList, ...projectList, ];
    const traitNm = (item: TraitSearchItemVo) => (item.traitNm ?? '').toString();
    merged.sort((itemA, itemB) => (
      traitNm(itemA).localeCompare(traitNm(itemB))
    ));

    merged.sort((itemA, itemB) => (
      traitNm(itemA).localeCompare(traitNm(itemB))
    ));

    const totalCnt = merged.length;
    const offset = (page - 1) * pageSize;
    const list = merged.slice(offset, offset + pageSize);
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<TraitSearchItemVo> = {
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
