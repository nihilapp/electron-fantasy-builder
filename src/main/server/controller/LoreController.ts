import { Hono } from 'hono';

import type { LoreVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { loreSchema } from '@zod-schema/lore.schema';

import { LoreService } from '../service/LoreService';

const lores = new Hono();

function parsePrjNo(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

lores.get('/', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  if (prjNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo는 필수이며 숫자여야 합니다.', }, 200);
  const query = c.req.query();
  const params = loreSchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });
  return c.json(await LoreService.getList(prjNo, params), 200);
});

lores.get('/:loreNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const loreNo = Number(c.req.param('loreNo'));
  if (prjNo == null || Number.isNaN(loreNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, loreNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await LoreService.getByNo(prjNo, loreNo), 200);
});

lores.post('/', async (c) => {
  const raw = await c.req.json();
  const parsed = loreSchema.safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  const prjNo = parsed.data.prjNo ?? null;
  if (prjNo == null || !Number.isInteger(prjNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: 'prjNo는 필수이며 숫자여야 합니다.', }, 200);
  const loreNm = (parsed.data.loreNm ?? '').toString().trim();
  if (!loreNm) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: 'loreNm은 필수이며 비어 있을 수 없습니다.', }, 200);
  return c.json(await LoreService.create(prjNo, parsed.data), 200);
});

lores.patch('/:loreNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const loreNo = Number(c.req.param('loreNo'));
  if (prjNo == null || Number.isNaN(loreNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, loreNo는 필수이며 숫자여야 합니다.', }, 200);
  const raw = await c.req.json();
  const parsed = loreSchema.partial().safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await LoreService.update(prjNo, loreNo, parsed.data ?? {} as Partial<LoreVo>), 200);
});

lores.delete('/:loreNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const loreNo = Number(c.req.param('loreNo'));
  if (prjNo == null || Number.isNaN(loreNo)) return c.json({ data: { deleted: false, }, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, loreNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await LoreService.delete(prjNo, loreNo), 200);
});

export { lores as LoreController };
