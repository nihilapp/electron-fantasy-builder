import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { LoreVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { LoreMapper } from '../db/mapper/LoreMapper';

export const LoreService = {
  async getList(prjNo: number, params: LoreVo): Promise<ListResponseType<LoreVo>> {
    const { list, totalCnt, } = await LoreMapper.selectList(prjNo, params);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<LoreVo> = { list, totalCnt, pageSize, page, totalPage, isFirst: page <= 1, isLast: page >= totalPage, };

    return { data, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async getByNo(prjNo: number, loreNo: number): Promise<ResponseType<LoreVo | null>> {
    const row = await LoreMapper.selectByNo(prjNo, loreNo);

    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.LORE_NOT_FOUND, message: '전승/설화를 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async create(prjNo: number, vo: LoreVo): Promise<ResponseType<LoreVo>> {
    const inserted = await LoreMapper.insert({ ...vo, prjNo, });

    return { data: inserted, error: false, code: RESPONSE_CODE.CREATED, message: '', };
  },

  async update(prjNo: number, loreNo: number, vo: Partial<LoreVo>): Promise<ResponseType<LoreVo | null>> {
    const row = await LoreMapper.update(prjNo, loreNo, vo);

    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.LORE_NOT_FOUND, message: '전승/설화를 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async delete(prjNo: number, loreNo: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await LoreMapper.delete(prjNo, loreNo);

    if (!deleted) return { data: { deleted: false, }, error: true, code: RESPONSE_CODE.LORE_NOT_FOUND, message: '전승/설화를 찾을 수 없습니다.', };
    return { data: { deleted: true, }, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
};
