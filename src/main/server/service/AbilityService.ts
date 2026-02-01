import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { AbilityVo } from '@app-types/vo.types';
import { getEmptyAbility } from '@zod-schema/ability.schema';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { AbilityMapper } from '../db/mapper/AbilityMapper';

/**
 * 어빌리티 비즈니스 로직.
 * 요청/응답은 VO(AbilityVo) 사용.
 */
export const AbilityService = {
  async getList(params: AbilityVo): Promise<ListResponseType<AbilityVo>> {
    const { list, totalCnt, } = await AbilityMapper.selectList(params);
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<AbilityVo> = {
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

  async getByNo(abilityNo: number): Promise<ResponseType<AbilityVo | null>> {
    const row = await AbilityMapper.selectByNo(abilityNo);

    if (row === null) {
      return {
        data: getEmptyAbility(),
        error: false,
        code: RESPONSE_CODE.OK,
        message: '',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async create(vo: AbilityVo): Promise<ResponseType<AbilityVo>> {
    const inserted = await AbilityMapper.insert(vo);

    return {
      data: inserted,
      error: false,
      code: RESPONSE_CODE.CREATED,
      message: '',
    };
  },

  async update(abilityNo: number, vo: Partial<AbilityVo>): Promise<ResponseType<AbilityVo | null>> {
    const row = await AbilityMapper.update(abilityNo, vo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.NOT_FOUND,
        message: '어빌리티를 찾을 수 없습니다.',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async delete(abilityNo: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await AbilityMapper.delete(abilityNo);

    if (!deleted) {
      return {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.NOT_FOUND,
        message: '어빌리티를 찾을 수 없습니다.',
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
