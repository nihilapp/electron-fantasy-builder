import { Hono } from 'hono';

import type { OrganizationVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { organizationSchema } from '@zod-schema/organization.schema';

import { OrganizationService } from '../service/OrganizationService';

const organizations = new Hono();

function parsePrjNo(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

organizations.get('/', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  if (prjNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo는 필수이며 숫자여야 합니다.', }, 200);
  const query = c.req.query();
  const params = organizationSchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });
  return c.json(await OrganizationService.getList(prjNo, params), 200);
});

organizations.get('/:orgNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const orgNo = Number(c.req.param('orgNo'));
  if (prjNo == null || Number.isNaN(orgNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, orgNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await OrganizationService.getByNo(prjNo, orgNo), 200);
});

organizations.post('/', async (c) => {
  const raw = await c.req.json();
  const parsed = organizationSchema.safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  const prjNo = parsed.data.prjNo ?? null;
  if (prjNo == null || !Number.isInteger(prjNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: 'prjNo는 필수이며 숫자여야 합니다.', }, 200);
  const orgNm = (parsed.data.orgNm ?? '').toString().trim();
  if (!orgNm) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: 'orgNm은 필수이며 비어 있을 수 없습니다.', }, 200);
  return c.json(await OrganizationService.create(prjNo, parsed.data), 200);
});

organizations.patch('/:orgNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const orgNo = Number(c.req.param('orgNo'));
  if (prjNo == null || Number.isNaN(orgNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, orgNo는 필수이며 숫자여야 합니다.', }, 200);
  const raw = await c.req.json();
  const parsed = organizationSchema.partial().safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await OrganizationService.update(prjNo, orgNo, parsed.data ?? {} as Partial<OrganizationVo>), 200);
});

organizations.delete('/:orgNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const orgNo = Number(c.req.param('orgNo'));
  if (prjNo == null || Number.isNaN(orgNo)) return c.json({ data: { deleted: false, }, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, orgNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await OrganizationService.delete(prjNo, orgNo), 200);
});

export { organizations as OrganizationController };
