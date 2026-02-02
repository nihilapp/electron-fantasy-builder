import { Hono } from 'hono';

import type { RegionVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { regionSchema } from '@zod-schema/region.schema';

import { RegionService } from '../service/RegionService';

const regions = new Hono();

function parsePrjNo(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

regions.get('/', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  if (prjNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo는 필수이며 숫자여야 합니다.', }, 200);
  const query = c.req.query();
  const params = regionSchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });
  return c.json(await RegionService.getList(prjNo, params), 200);
});

regions.get('/:regionNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const regionNo = Number(c.req.param('regionNo'));
  if (prjNo == null || Number.isNaN(regionNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, regionNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await RegionService.getByNo(prjNo, regionNo), 200);
});

regions.post('/', async (c) => {
  const raw = await c.req.json();
  const parsed = regionSchema.safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  const prjNo = parsed.data.prjNo ?? null;
  if (prjNo == null || !Number.isInteger(prjNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: 'prjNo는 필수이며 숫자여야 합니다.', }, 200);
  const regionNm = (parsed.data.regionNm ?? '').toString().trim();
  if (!regionNm) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: 'regionNm은 필수이며 비어 있을 수 없습니다.', }, 200);
  return c.json(await RegionService.create(prjNo, parsed.data), 200);
});

regions.patch('/:regionNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const regionNo = Number(c.req.param('regionNo'));
  if (prjNo == null || Number.isNaN(regionNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, regionNo는 필수이며 숫자여야 합니다.', }, 200);
  const raw = await c.req.json();
  const parsed = regionSchema.partial().safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await RegionService.update(prjNo, regionNo, parsed.data ?? {} as Partial<RegionVo>), 200);
});

regions.delete('/:regionNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const regionNo = Number(c.req.param('regionNo'));
  if (prjNo == null || Number.isNaN(regionNo)) return c.json({ data: { deleted: false, }, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, regionNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await RegionService.delete(prjNo, regionNo), 200);
});

export { regions as RegionController };
