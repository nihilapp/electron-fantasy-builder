import type { ResponseType } from '@app-types/response.types';
import type { CharTraitMapVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { CharTraitMapMapper } from './CharTraitMapMapper';

export const CharTraitMapService = {
  async getList(charNo: number): Promise<ResponseType<CharTraitMapVo[]>> {
    const list = await CharTraitMapMapper.selectList(charNo);
    return { data: list, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async getOne(charNo: number, traitNo: number, traitType: string): Promise<ResponseType<CharTraitMapVo | null>> {
    const row = await CharTraitMapMapper.selectOne(charNo, traitNo, traitType);
    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.CHAR_TRAIT_MAP_NOT_FOUND, message: '인물-특성 매핑을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async create(vo: CharTraitMapVo): Promise<ResponseType<CharTraitMapVo>> {
    const inserted = await CharTraitMapMapper.insert(vo);
    return { data: inserted, error: false, code: RESPONSE_CODE.CREATED, message: '', };
  },
  async update(charNo: number, traitNo: number, traitType: string, vo: Partial<CharTraitMapVo>): Promise<ResponseType<CharTraitMapVo | null>> {
    const row = await CharTraitMapMapper.update(charNo, traitNo, traitType, vo);
    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.CHAR_TRAIT_MAP_NOT_FOUND, message: '인물-특성 매핑을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async delete(charNo: number, traitNo: number, traitType: string): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await CharTraitMapMapper.delete(charNo, traitNo, traitType);
    if (!deleted) return { data: { deleted: false, }, error: true, code: RESPONSE_CODE.CHAR_TRAIT_MAP_NOT_FOUND, message: '인물-특성 매핑을 찾을 수 없습니다.', };
    return { data: { deleted: true, }, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
};
