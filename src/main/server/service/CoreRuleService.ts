import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { CoreRuleVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { CoreRuleMapper } from '../db/mapper/CoreRuleMapper';

/**
 * 코어 설정 비즈니스 로직.
 * prjNo 스코프 하에 CRUD. 요청/응답은 VO(CoreRuleVo) 사용.
 */
export const CoreRuleService = {
  async getList(
    prjNo: number,
    params: CoreRuleVo
  ): Promise<ListResponseType<CoreRuleVo>> {
    const { list, totalCnt, } = await CoreRuleMapper.selectList(prjNo, params);
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<CoreRuleVo> = {
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

  async getByNo(prjNo: number, coreNo: number): Promise<ResponseType<CoreRuleVo | null>> {
    const row = await CoreRuleMapper.selectByNo(prjNo, coreNo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.CORE_RULE_NOT_FOUND,
        message: '코어 설정을 찾을 수 없습니다.',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async create(prjNo: number, vo: CoreRuleVo): Promise<ResponseType<CoreRuleVo>> {
    const inserted = await CoreRuleMapper.insert({ ...vo, prjNo, });

    return {
      data: inserted,
      error: false,
      code: RESPONSE_CODE.CREATED,
      message: '',
    };
  },

  async update(
    prjNo: number,
    coreNo: number,
    vo: Partial<CoreRuleVo>
  ): Promise<ResponseType<CoreRuleVo | null>> {
    const row = await CoreRuleMapper.update(prjNo, coreNo, vo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.CORE_RULE_NOT_FOUND,
        message: '코어 설정을 찾을 수 없습니다.',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async delete(prjNo: number, coreNo: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await CoreRuleMapper.delete(prjNo, coreNo);

    if (!deleted) {
      return {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.CORE_RULE_NOT_FOUND,
        message: '코어 설정을 찾을 수 없습니다.',
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
