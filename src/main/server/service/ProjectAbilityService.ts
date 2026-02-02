import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { ProjectAbilityVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { ProjectAbilityMapper } from '../db/mapper/ProjectAbilityMapper';

/**
 * 프로젝트 종속 어빌리티 비즈니스 로직.
 * prjNo 스코프 하에 CRUD. 요청/응답은 VO(ProjectAbilityVo) 사용.
 */
export const ProjectAbilityService = {
  async getList(
    prjNo: number,
    params: ProjectAbilityVo
  ): Promise<ListResponseType<ProjectAbilityVo>> {
    const { list, totalCnt, } = await ProjectAbilityMapper.selectList(prjNo, params);
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<ProjectAbilityVo> = {
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
    abilityNo: number
  ): Promise<ResponseType<ProjectAbilityVo | null>> {
    const row = await ProjectAbilityMapper.selectByNo(prjNo, abilityNo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.PROJECT_ABILITY_NOT_FOUND,
        message: '프로젝트 종속 어빌리티를 찾을 수 없습니다.',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async create(prjNo: number, vo: ProjectAbilityVo): Promise<ResponseType<ProjectAbilityVo>> {
    const inserted = await ProjectAbilityMapper.insert({ ...vo, prjNo, });

    return {
      data: inserted,
      error: false,
      code: RESPONSE_CODE.CREATED,
      message: '',
    };
  },

  async update(
    prjNo: number,
    abilityNo: number,
    vo: Partial<ProjectAbilityVo>
  ): Promise<ResponseType<ProjectAbilityVo | null>> {
    const row = await ProjectAbilityMapper.update(prjNo, abilityNo, vo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.PROJECT_ABILITY_NOT_FOUND,
        message: '프로젝트 종속 어빌리티를 찾을 수 없습니다.',
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
    abilityNo: number
  ): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await ProjectAbilityMapper.delete(prjNo, abilityNo);

    if (!deleted) {
      return {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.PROJECT_ABILITY_NOT_FOUND,
        message: '프로젝트 종속 어빌리티를 찾을 수 없습니다.',
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
