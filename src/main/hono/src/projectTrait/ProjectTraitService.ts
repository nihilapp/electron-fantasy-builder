import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { ProjectTraitVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { ProjectTraitMapper } from './ProjectTraitMapper';

/**
 * 프로젝트 종속 특성 비즈니스 로직.
 * prjNo 스코프 하에 CRUD. 요청/응답은 VO(ProjectTraitVo) 사용.
 */
export const ProjectTraitService = {
  async getList(
    prjNo: number,
    params: ProjectTraitVo
  ): Promise<ListResponseType<ProjectTraitVo>> {
    const { list, totalCnt, } = await ProjectTraitMapper.selectList(prjNo, params);
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<ProjectTraitVo> = {
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

  async getByNo(
    prjNo: number,
    traitNo: number
  ): Promise<ResponseType<ProjectTraitVo | null>> {
    const row = await ProjectTraitMapper.selectByNo(prjNo, traitNo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.PROJECT_TRAIT_NOT_FOUND,
        message: '프로젝트 종속 특성을 찾을 수 없습니다.',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async create(prjNo: number, vo: ProjectTraitVo): Promise<ResponseType<ProjectTraitVo>> {
    const inserted = await ProjectTraitMapper.insert({ ...vo, prjNo, });

    return {
      data: inserted,
      error: false,
      code: RESPONSE_CODE.CREATED,
      message: '',
    };
  },

  async update(
    prjNo: number,
    traitNo: number,
    vo: Partial<ProjectTraitVo>
  ): Promise<ResponseType<ProjectTraitVo | null>> {
    const row = await ProjectTraitMapper.update(prjNo, traitNo, vo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.PROJECT_TRAIT_NOT_FOUND,
        message: '프로젝트 종속 특성을 찾을 수 없습니다.',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async delete(
    prjNo: number,
    traitNo: number
  ): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await ProjectTraitMapper.delete(prjNo, traitNo);

    if (!deleted) {
      return {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.PROJECT_TRAIT_NOT_FOUND,
        message: '프로젝트 종속 특성을 찾을 수 없습니다.',
      };
    }

    return {
      data: { deleted: true, },
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },
};
