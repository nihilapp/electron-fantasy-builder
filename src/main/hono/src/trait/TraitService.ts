import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { TraitVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { TraitMapper } from './TraitMapper';

/**
 * 트레잇 비즈니스 로직.
 * 요청/응답은 VO(TraitVo) 사용.
 */
export const TraitService = {
  async getList(params: TraitVo): Promise<ListResponseType<TraitVo>> {
    const { list, totalCnt, } = await TraitMapper.selectList(params);
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<TraitVo> = {
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

  async getByNo(traitNo: number): Promise<ResponseType<TraitVo | null>> {
    const row = await TraitMapper.selectByNo(traitNo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.NOT_FOUND, // Assuming generic NOT_FOUND or mapped later
        message: '트레잇을 찾을 수 없습니다.',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async create(vo: TraitVo): Promise<ResponseType<TraitVo>> {
    const inserted = await TraitMapper.insert(vo);

    return {
      data: inserted,
      error: false,
      code: RESPONSE_CODE.CREATED,
      message: '',
    };
  },

  async update(traitNo: number, vo: Partial<TraitVo>): Promise<ResponseType<TraitVo | null>> {
    const row = await TraitMapper.update(traitNo, vo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.NOT_FOUND,
        message: '트레잇을 찾을 수 없습니다.',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async delete(traitNo: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await TraitMapper.delete(traitNo);

    if (!deleted) {
      return {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.NOT_FOUND,
        message: '트레잇을 찾을 수 없습니다.',
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
