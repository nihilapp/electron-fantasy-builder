import { Hono } from 'hono';

import type { CharTraitMapVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { charTraitMapSchema, traitTypeEnum } from '@zod-schema/charTraitMap.schema';

import { CharTraitMapService } from '../service/CharTraitMapService';

/** /char-trait-maps. 목록/단건: charNo(필수), 단건 추가: traitNo, traitType. */
const charTraitMaps = new Hono();

function parseNum(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

charTraitMaps.get('/', async (c) => {
  const charNo = parseNum(c.req.query('charNo'));
  if (charNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'charNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await CharTraitMapService.getList(charNo), 200);
});

charTraitMaps.get('/one', async (c) => {
  const charNo = parseNum(c.req.query('charNo'));
  const traitNo = parseNum(c.req.query('traitNo'));
  const traitType = c.req.query('traitType');
  if (charNo == null || traitNo == null || !traitType || !traitTypeEnum.safeParse(traitType).success) {
    return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'charNo, traitNo, traitType(GLOBAL|PROJECT)는 필수입니다.', }, 200);
  }
  return c.json(await CharTraitMapService.getOne(charNo, traitNo, traitType), 200);
});

charTraitMaps.post('/', async (c) => {
  const raw = await c.req.json();
  const parsed = charTraitMapSchema.safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await CharTraitMapService.create(parsed.data), 200);
});

charTraitMaps.patch('/', async (c) => {
  const charNo = parseNum(c.req.query('charNo'));
  const traitNo = parseNum(c.req.query('traitNo'));
  const traitType = c.req.query('traitType');
  if (charNo == null || traitNo == null || !traitType || !traitTypeEnum.safeParse(traitType).success) {
    return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'charNo, traitNo, traitType(GLOBAL|PROJECT)는 필수입니다.', }, 200);
  }
  const raw = await c.req.json();
  const parsed = charTraitMapSchema.partial().safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await CharTraitMapService.update(charNo, traitNo, traitType, parsed.data ?? {} as Partial<CharTraitMapVo>), 200);
});

charTraitMaps.delete('/', async (c) => {
  const charNo = parseNum(c.req.query('charNo'));
  const traitNo = parseNum(c.req.query('traitNo'));
  const traitType = c.req.query('traitType');
  if (charNo == null || traitNo == null || !traitType || !traitTypeEnum.safeParse(traitType).success) {
    return c.json({ data: { deleted: false, }, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'charNo, traitNo, traitType(GLOBAL|PROJECT)는 필수입니다.', }, 200);
  }
  return c.json(await CharTraitMapService.delete(charNo, traitNo, traitType), 200);
});

export { charTraitMaps as CharTraitMapController };
