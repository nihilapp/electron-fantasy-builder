import { Hono } from 'hono';

import type { ItemVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { itemSchema } from '@zod-schema/item.schema';

import { ItemService } from '../service/ItemService';

const items = new Hono();

function parsePrjNo(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

items.get('/', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  if (prjNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo는 필수이며 숫자여야 합니다.', }, 200);
  const query = c.req.query();
  const params = itemSchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });
  return c.json(await ItemService.getList(prjNo, params), 200);
});

items.get('/:itemNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const itemNo = Number(c.req.param('itemNo'));
  if (prjNo == null || Number.isNaN(itemNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, itemNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await ItemService.getByNo(prjNo, itemNo), 200);
});

items.post('/', async (c) => {
  const raw = await c.req.json();
  const parsed = itemSchema.safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  const prjNo = parsed.data.prjNo ?? null;
  if (prjNo == null || !Number.isInteger(prjNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: 'prjNo는 필수이며 숫자여야 합니다.', }, 200);
  const itemNm = (parsed.data.itemNm ?? '').toString().trim();
  if (!itemNm) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: 'itemNm은 필수이며 비어 있을 수 없습니다.', }, 200);
  return c.json(await ItemService.create(prjNo, parsed.data), 200);
});

items.patch('/:itemNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const itemNo = Number(c.req.param('itemNo'));
  if (prjNo == null || Number.isNaN(itemNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, itemNo는 필수이며 숫자여야 합니다.', }, 200);
  const raw = await c.req.json();
  const parsed = itemSchema.partial().safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await ItemService.update(prjNo, itemNo, parsed.data ?? {} as Partial<ItemVo>), 200);
});

items.delete('/:itemNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const itemNo = Number(c.req.param('itemNo'));
  if (prjNo == null || Number.isNaN(itemNo)) return c.json({ data: { deleted: false, }, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, itemNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await ItemService.delete(prjNo, itemNo), 200);
});

export { items as ItemController };
