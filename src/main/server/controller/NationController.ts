import { Hono } from 'hono';

import type { NationVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { nationSchema } from '@zod-schema/nation.schema';

import { NationService } from '../service/NationService';

const nations = new Hono();

function parsePrjNo(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

nations.get('/', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  if (prjNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo는 필수이며 숫자여야 합니다.', }, 200);
  const query = c.req.query();
  const params = nationSchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });
  return c.json(await NationService.getList(prjNo, params), 200);
});

nations.get('/:ntnNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const ntnNo = Number(c.req.param('ntnNo'));
  if (prjNo == null || Number.isNaN(ntnNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, ntnNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await NationService.getByNo(prjNo, ntnNo), 200);
});

nations.post('/', async (c) => {
  const raw = await c.req.json();
  const parsed = nationSchema.safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  const prjNo = parsed.data.prjNo ?? null;
  if (prjNo == null || !Number.isInteger(prjNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: 'prjNo는 필수이며 숫자여야 합니다.', }, 200);
  const ntnNm = (parsed.data.ntnNm ?? '').toString().trim();
  if (!ntnNm) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: 'ntnNm은 필수이며 비어 있을 수 없습니다.', }, 200);
  return c.json(await NationService.create(prjNo, parsed.data), 200);
});

nations.patch('/:ntnNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const ntnNo = Number(c.req.param('ntnNo'));
  if (prjNo == null || Number.isNaN(ntnNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, ntnNo는 필수이며 숫자여야 합니다.', }, 200);
  const raw = await c.req.json();
  const parsed = nationSchema.partial().safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await NationService.update(prjNo, ntnNo, parsed.data ?? {} as Partial<NationVo>), 200);
});

nations.delete('/:ntnNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const ntnNo = Number(c.req.param('ntnNo'));
  if (prjNo == null || Number.isNaN(ntnNo)) return c.json({ data: { deleted: false, }, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, ntnNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await NationService.delete(prjNo, ntnNo), 200);
});

export { nations as NationController };
