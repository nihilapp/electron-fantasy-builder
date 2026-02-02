import { Hono } from 'hono';

import type { CreatureTraitMapVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { creatureTraitMapSchema } from '@zod-schema/creatureTraitMap.schema';

import { CreatureTraitMapService } from '../service/CreatureTraitMapService';

/** /creature-trait-maps. 목록: ?creatureNo=, 단건: /:mapNo. */
const creatureTraitMaps = new Hono();

function parseNum(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

creatureTraitMaps.get('/', async (c) => {
  const creatureNo = parseNum(c.req.query('creatureNo'));
  if (creatureNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'creatureNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await CreatureTraitMapService.getList(creatureNo), 200);
});

creatureTraitMaps.get('/:mapNo', async (c) => {
  const mapNo = parseNum(c.req.param('mapNo'));
  if (mapNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'mapNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await CreatureTraitMapService.getByMapNo(mapNo), 200);
});

creatureTraitMaps.post('/', async (c) => {
  const raw = await c.req.json();
  const parsed = creatureTraitMapSchema.safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await CreatureTraitMapService.create(parsed.data), 200);
});

creatureTraitMaps.patch('/:mapNo', async (c) => {
  const mapNo = parseNum(c.req.param('mapNo'));
  if (mapNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'mapNo는 필수이며 숫자여야 합니다.', }, 200);
  const raw = await c.req.json();
  const parsed = creatureTraitMapSchema.partial().safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await CreatureTraitMapService.update(mapNo, parsed.data ?? {} as Partial<CreatureTraitMapVo>), 200);
});

creatureTraitMaps.delete('/:mapNo', async (c) => {
  const mapNo = parseNum(c.req.param('mapNo'));
  if (mapNo == null) return c.json({ data: { deleted: false, }, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'mapNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await CreatureTraitMapService.delete(mapNo), 200);
});

export { creatureTraitMaps as CreatureTraitMapController };
