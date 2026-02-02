import { Hono } from 'hono';

import type { CharAbilityMapVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { abilityTypeEnum, charAbilityMapSchema } from '@zod-schema/charAbilityMap.schema';

import { CharAbilityMapService } from '../service/CharAbilityMapService';

const charAbilityMaps = new Hono();

function parseNum(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

charAbilityMaps.get('/', async (c) => {
  const charNo = parseNum(c.req.query('charNo'));
  if (charNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'charNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await CharAbilityMapService.getList(charNo), 200);
});

charAbilityMaps.get('/one', async (c) => {
  const charNo = parseNum(c.req.query('charNo'));
  const abilityNo = parseNum(c.req.query('abilityNo'));
  const abilityType = c.req.query('abilityType');
  if (charNo == null || abilityNo == null || !abilityType || !abilityTypeEnum.safeParse(abilityType).success) {
    return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'charNo, abilityNo, abilityType(GLOBAL|PROJECT)는 필수입니다.', }, 200);
  }
  return c.json(await CharAbilityMapService.getOne(charNo, abilityNo, abilityType), 200);
});

charAbilityMaps.post('/', async (c) => {
  const raw = await c.req.json();
  const parsed = charAbilityMapSchema.safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await CharAbilityMapService.create(parsed.data), 200);
});

charAbilityMaps.patch('/', async (c) => {
  const charNo = parseNum(c.req.query('charNo'));
  const abilityNo = parseNum(c.req.query('abilityNo'));
  const abilityType = c.req.query('abilityType');
  if (charNo == null || abilityNo == null || !abilityType || !abilityTypeEnum.safeParse(abilityType).success) {
    return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'charNo, abilityNo, abilityType(GLOBAL|PROJECT)는 필수입니다.', }, 200);
  }
  const raw = await c.req.json();
  const parsed = charAbilityMapSchema.partial().safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await CharAbilityMapService.update(charNo, abilityNo, abilityType, parsed.data ?? {} as Partial<CharAbilityMapVo>), 200);
});

charAbilityMaps.delete('/', async (c) => {
  const charNo = parseNum(c.req.query('charNo'));
  const abilityNo = parseNum(c.req.query('abilityNo'));
  const abilityType = c.req.query('abilityType');
  if (charNo == null || abilityNo == null || !abilityType || !abilityTypeEnum.safeParse(abilityType).success) {
    return c.json({ data: { deleted: false, }, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'charNo, abilityNo, abilityType(GLOBAL|PROJECT)는 필수입니다.', }, 200);
  }
  return c.json(await CharAbilityMapService.delete(charNo, abilityNo, abilityType), 200);
});

export { charAbilityMaps as CharAbilityMapController };
