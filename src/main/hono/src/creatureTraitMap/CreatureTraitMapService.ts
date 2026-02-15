import type { ResponseType } from '@app-types/response.types';
import type { CreatureTraitMapVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { CreatureTraitMapMapper } from './CreatureTraitMapMapper';

export const CreatureTraitMapService = {
  async getList(creatureNo: number): Promise<ResponseType<CreatureTraitMapVo[]>> {
    const list = await CreatureTraitMapMapper.selectList(creatureNo);
    return { data: list, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async getByMapNo(mapNo: number): Promise<ResponseType<CreatureTraitMapVo | null>> {
    const row = await CreatureTraitMapMapper.selectByMapNo(mapNo);
    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.CREATURE_TRAIT_MAP_NOT_FOUND, message: '종족-특성 매핑을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async create(vo: CreatureTraitMapVo): Promise<ResponseType<CreatureTraitMapVo>> {
    const inserted = await CreatureTraitMapMapper.insert(vo);
    return { data: inserted, error: false, code: RESPONSE_CODE.CREATED, message: '', };
  },
  async update(mapNo: number, vo: Partial<CreatureTraitMapVo>): Promise<ResponseType<CreatureTraitMapVo | null>> {
    const row = await CreatureTraitMapMapper.update(mapNo, vo);
    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.CREATURE_TRAIT_MAP_NOT_FOUND, message: '종족-특성 매핑을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
  async delete(mapNo: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await CreatureTraitMapMapper.delete(mapNo);
    if (!deleted) return { data: { deleted: false, }, error: true, code: RESPONSE_CODE.CREATURE_TRAIT_MAP_NOT_FOUND, message: '종족-특성 매핑을 찾을 수 없습니다.', };
    return { data: { deleted: true, }, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
};
