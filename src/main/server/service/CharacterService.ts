import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { CharacterVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { CharacterMapper } from '../db/mapper/CharacterMapper';

export const CharacterService = {
  async getList(prjNo: number, params: CharacterVo): Promise<ListResponseType<CharacterVo>> {
    const { list, totalCnt, } = await CharacterMapper.selectList(prjNo, params);
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));
    const data: ListType<CharacterVo> = { list, totalCnt, pageSize, page, totalPage, isFirst: page <= 1, isLast: page >= totalPage, };
    return { data, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async getByNo(prjNo: number, charNo: number): Promise<ResponseType<CharacterVo | null>> {
    const row = await CharacterMapper.selectByNo(prjNo, charNo);
    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.CHARACTER_NOT_FOUND, message: '인물을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async create(prjNo: number, vo: CharacterVo): Promise<ResponseType<CharacterVo>> {
    const inserted = await CharacterMapper.insert({ ...vo, prjNo, });
    return { data: inserted, error: false, code: RESPONSE_CODE.CREATED, message: '', };
  },
  async update(prjNo: number, charNo: number, vo: Partial<CharacterVo>): Promise<ResponseType<CharacterVo | null>> {
    const row = await CharacterMapper.update(prjNo, charNo, vo);
    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.CHARACTER_NOT_FOUND, message: '인물을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async delete(prjNo: number, charNo: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await CharacterMapper.delete(prjNo, charNo);
    if (!deleted) return { data: { deleted: false, }, error: true, code: RESPONSE_CODE.CHARACTER_NOT_FOUND, message: '인물을 찾을 수 없습니다.', };
    return { data: { deleted: true, }, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
};
