import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { CreatureVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { CreatureMapper } from './CreatureMapper';

/**
 * 생물/종족 비즈니스 로직.
 * prjNo 스코프 하에 CRUD. 요청/응답은 VO(CreatureVo) 사용.
 */
export const CreatureService = {
  async getList(
    prjNo: number,
    params: CreatureVo
  ): Promise<ListResponseType<CreatureVo>> {
    const { list, totalCnt, } = await CreatureMapper.selectList(prjNo, params);
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<CreatureVo> = {
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

  async getByNo(prjNo: number, creatureNo: number): Promise<ResponseType<CreatureVo | null>> {
    const row = await CreatureMapper.selectByNo(prjNo, creatureNo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.CREATURE_NOT_FOUND,
        message: '생물/종족을 찾을 수 없습니다.',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async create(prjNo: number, vo: CreatureVo): Promise<ResponseType<CreatureVo>> {
    const inserted = await CreatureMapper.insert({ ...vo, prjNo, });

    return {
      data: inserted,
      error: false,
      code: RESPONSE_CODE.CREATED,
      message: '',
    };
  },

  async update(
    prjNo: number,
    creatureNo: number,
    vo: Partial<CreatureVo>
  ): Promise<ResponseType<CreatureVo | null>> {
    const row = await CreatureMapper.update(prjNo, creatureNo, vo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.CREATURE_NOT_FOUND,
        message: '생물/종족을 찾을 수 없습니다.',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async delete(prjNo: number, creatureNo: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await CreatureMapper.delete(prjNo, creatureNo);

    if (!deleted) {
      return {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.CREATURE_NOT_FOUND,
        message: '생물/종족을 찾을 수 없습니다.',
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
