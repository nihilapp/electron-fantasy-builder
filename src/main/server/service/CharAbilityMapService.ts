import type { ResponseType } from '@app-types/response.types';
import type { CharAbilityMapVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { CharAbilityMapMapper } from '../db/mapper/CharAbilityMapMapper';

export const CharAbilityMapService = {
  async getList(charNo: number): Promise<ResponseType<CharAbilityMapVo[]>> {
    const list = await CharAbilityMapMapper.selectList(charNo);
    return { data: list, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async getOne(charNo: number, abilityNo: number, abilityType: string): Promise<ResponseType<CharAbilityMapVo | null>> {
    const row = await CharAbilityMapMapper.selectOne(charNo, abilityNo, abilityType);
    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.CHAR_ABILITY_MAP_NOT_FOUND, message: '인물-어빌리티 매핑을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async create(vo: CharAbilityMapVo): Promise<ResponseType<CharAbilityMapVo>> {
    const inserted = await CharAbilityMapMapper.insert(vo);
    return { data: inserted, error: false, code: RESPONSE_CODE.CREATED, message: '', };
  },
  async update(charNo: number, abilityNo: number, abilityType: string, vo: Partial<CharAbilityMapVo>): Promise<ResponseType<CharAbilityMapVo | null>> {
    const row = await CharAbilityMapMapper.update(charNo, abilityNo, abilityType, vo);
    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.CHAR_ABILITY_MAP_NOT_FOUND, message: '인물-어빌리티 매핑을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async delete(charNo: number, abilityNo: number, abilityType: string): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await CharAbilityMapMapper.delete(charNo, abilityNo, abilityType);
    if (!deleted) return { data: { deleted: false, }, error: true, code: RESPONSE_CODE.CHAR_ABILITY_MAP_NOT_FOUND, message: '인물-어빌리티 매핑을 찾을 수 없습니다.', };
    return { data: { deleted: true, }, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
};
