import type { ResponseType } from '@app-types/response.types';
import type { CreatureAbilityMapVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { CreatureAbilityMapMapper } from './CreatureAbilityMapMapper';

export const CreatureAbilityMapService = {
  async getList(creatureNo: number): Promise<ResponseType<CreatureAbilityMapVo[]>> {
    const list = await CreatureAbilityMapMapper.selectList(creatureNo);
    return { data: list, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async getByMapNo(mapNo: number): Promise<ResponseType<CreatureAbilityMapVo | null>> {
    const row = await CreatureAbilityMapMapper.selectByMapNo(mapNo);
    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.CREATURE_ABILITY_MAP_NOT_FOUND, message: '종족-어빌리티 매핑을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async create(vo: CreatureAbilityMapVo): Promise<ResponseType<CreatureAbilityMapVo>> {
    const inserted = await CreatureAbilityMapMapper.insert(vo);
    return { data: inserted, error: false, code: RESPONSE_CODE.CREATED, message: '', };
  },
  async update(mapNo: number, vo: Partial<CreatureAbilityMapVo>): Promise<ResponseType<CreatureAbilityMapVo | null>> {
    const row = await CreatureAbilityMapMapper.update(mapNo, vo);
    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.CREATURE_ABILITY_MAP_NOT_FOUND, message: '종족-어빌리티 매핑을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async delete(mapNo: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await CreatureAbilityMapMapper.delete(mapNo);
    if (!deleted) return { data: { deleted: false, }, error: true, code: RESPONSE_CODE.CREATURE_ABILITY_MAP_NOT_FOUND, message: '종족-어빌리티 매핑을 찾을 수 없습니다.', };
    return { data: { deleted: true, }, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
};
