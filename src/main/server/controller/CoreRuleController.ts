import { Hono } from 'hono';

import { RESPONSE_CODE } from '@constants/response-code.const';
import { coreRuleSchema } from '@zod-schema/coreRule.schema';

import { CoreRuleService } from '../service/CoreRuleService';

/**
 * 코어 설정 API 컨트롤러.
 * /core-rules 에 마운트. prjNo는 쿼리(GET/PATCH/DELETE) 또는 바디(POST)로 전달.
 * GET/POST /core-rules, GET/PATCH/DELETE /core-rules/:coreNo.
 */
const coreRules = new Hono();

function parsePrjNo(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

coreRules.get('/', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));

  if (prjNo == null) {
    return context.json({
      data: null,
      error: true,
      code: RESPONSE_CODE.BAD_REQUEST,
      message: 'prjNo는 필수이며 숫자여야 합니다.',
    }, 200);
  }

  const query = context.req.query();
  const params = coreRuleSchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await CoreRuleService.getList(prjNo, params);

  return context.json(body, 200);
});

coreRules.get('/:coreNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const coreNo = Number(context.req.param('coreNo'));

  if (prjNo == null || Number.isNaN(coreNo)) {
    return context.json({
      data: null,
      error: true,
      code: RESPONSE_CODE.BAD_REQUEST,
      message: 'prjNo, coreNo는 필수이며 숫자여야 합니다.',
    }, 200);
  }

  const body = await CoreRuleService.getByNo(prjNo, coreNo);

  return context.json(body, 200);
});

coreRules.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = coreRuleSchema.safeParse(raw);

  if (!parsed.success) {
    return context.json({
      data: null,
      error: true,
      code: RESPONSE_CODE.VALIDATION_ERROR,
      message: parsed.error.issues.map((issue) => issue.message).join('; ') || '요청 검증 실패',
    }, 200);
  }

  const prjNo = parsed.data.prjNo ?? null;
  if (prjNo == null || !Number.isInteger(prjNo)) {
    return context.json({
      data: null,
      error: true,
      code: RESPONSE_CODE.VALIDATION_ERROR,
      message: 'prjNo는 필수이며 숫자여야 합니다.',
    }, 200);
  }

  const coreNm = (parsed.data.coreNm ?? '').toString().trim();
  if (!coreNm) {
    return context.json({
      data: null,
      error: true,
      code: RESPONSE_CODE.VALIDATION_ERROR,
      message: 'coreNm은 필수이며 비어 있을 수 없습니다.',
    }, 200);
  }

  const result = await CoreRuleService.create(prjNo, parsed.data);

  return context.json(result, 200);
});

coreRules.patch('/:coreNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const coreNo = Number(context.req.param('coreNo'));

  if (prjNo == null || Number.isNaN(coreNo)) {
    return context.json({
      data: null,
      error: true,
      code: RESPONSE_CODE.BAD_REQUEST,
      message: 'prjNo, coreNo는 필수이며 숫자여야 합니다.',
    }, 200);
  }

  const raw = await context.req.json();
  const parsed = coreRuleSchema.partial().safeParse(raw);

  if (!parsed.success) {
    return context.json({
      data: null,
      error: true,
      code: RESPONSE_CODE.VALIDATION_ERROR,
      message: parsed.error.issues.map((issue) => issue.message).join('; ') || '요청 검증 실패',
    }, 200);
  }

  const result = await CoreRuleService.update(prjNo, coreNo, parsed.data ?? {});

  return context.json(result, 200);
});

coreRules.delete('/:coreNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const coreNo = Number(context.req.param('coreNo'));

  if (prjNo == null || Number.isNaN(coreNo)) {
    return context.json({
      data: { deleted: false, },
      error: true,
      code: RESPONSE_CODE.BAD_REQUEST,
      message: 'prjNo, coreNo는 필수이며 숫자여야 합니다.',
    }, 200);
  }

  const result = await CoreRuleService.delete(prjNo, coreNo);

  return context.json(result, 200);
});

export { coreRules as CoreRuleController };
