import { Hono } from 'hono';

import type { CreatureAbilityMapVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { creatureAbilityMapSchema } from '@zod-schema/creatureAbilityMap.schema';

import { CreatureAbilityMapService } from '../service/CreatureAbilityMapService';

const creatureAbilityMaps = new Hono();

function parseNum(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

creatureAbilityMaps.get('/', async (c) => {
  const creatureNo = parseNum(c.req.query('creatureNo'));
  if (creatureNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'creatureNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await CreatureAbilityMapService.getList(creatureNo), 200);
});

creatureAbilityMaps.get('/:mapNo', async (c) => {
  const mapNo = parseNum(c.req.param('mapNo'));
  if (mapNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'mapNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await CreatureAbilityMapService.getByMapNo(mapNo), 200);
});

creatureAbilityMaps.post('/', async (c) => {
  const raw = await c.req.json();
  const parsed = creatureAbilityMapSchema.safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await CreatureAbilityMapService.create(parsed.data), 200);
});

creatureAbilityMaps.patch('/:mapNo', async (c) => {
  const mapNo = parseNum(c.req.param('mapNo'));
  if (mapNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'mapNo는 필수이며 숫자여야 합니다.', }, 200);
  const raw = await c.req.json();
  const parsed = creatureAbilityMapSchema.partial().safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await CreatureAbilityMapService.update(mapNo, parsed.data ?? {} as Partial<CreatureAbilityMapVo>), 200);
});

creatureAbilityMaps.delete('/:mapNo', async (c) => {
  const mapNo = parseNum(c.req.param('mapNo'));
  if (mapNo == null) return c.json({ data: { deleted: false, }, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'mapNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await CreatureAbilityMapService.delete(mapNo), 200);
});

export { creatureAbilityMaps as CreatureAbilityMapController };
