import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { ProjectVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { ProjectMapper } from '../db/mapper/ProjectMapper';

/**
 * 프로젝트 비즈니스 로직.
 * 요청은 VO(ProjectVo), 응답 TData에는 VO(ProjectVo) 사용.
 */
export const ProjectService = {
  async getList(params: ProjectVo): Promise<ListResponseType<ProjectVo>> {
    const { list, totalCnt, } = await ProjectMapper.selectList(params);
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<ProjectVo> = {
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

  async getByNo(prjNo: number): Promise<ResponseType<ProjectVo | null>> {
    const row = await ProjectMapper.selectByNo(prjNo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.PROJECT_NOT_FOUND,
        message: '프로젝트를 찾을 수 없습니다.',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async create(vo: ProjectVo): Promise<ResponseType<ProjectVo>> {
    const inserted = await ProjectMapper.insert(vo);

    return {
      data: inserted,
      error: false,
      code: RESPONSE_CODE.CREATED,
      message: '',
    };
  },

  async update(prjNo: number, vo: Partial<ProjectVo>): Promise<ResponseType<ProjectVo | null>> {
    const row = await ProjectMapper.update(prjNo, vo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.PROJECT_NOT_FOUND,
        message: '프로젝트를 찾을 수 없습니다.',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async delete(prjNo: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await ProjectMapper.delete(prjNo);

    if (!deleted) {
      return {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.PROJECT_NOT_FOUND,
        message: '프로젝트를 찾을 수 없습니다.',
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
