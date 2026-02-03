import { Hono } from 'hono';

import { RESPONSE_CODE } from '@constants/response-code.const';
import { coreRuleSchema } from '@zod-schema/coreRule.schema';

import { CoreRuleService } from '../service/CoreRuleService';

/**
 * @description 코어 설정 API 컨트롤러. /core-rules 마운트. prjNo는 쿼리(GET/PATCH/DELETE) 또는 바디(POST)로 전달.
 */
const coreRules = new Hono();

/**
 * @description 쿼리/바디의 prjNo 문자열을 숫자로 파싱. 유효하지 않으면 null.
 * @param raw prjNo 문자열
 */
function parsePrjNo(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

/**
 * @description 코어 설정 목록 조회.
 * @param context Hono 컨텍스트
 */
coreRules.get('/', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));

  if (prjNo == null) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
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

  return context.json(
    body,
    200
  );
});

/**
 * @description 코어 설정 상세 조회.
 * @param context Hono 컨텍스트
 */
coreRules.get('/:coreNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const coreNo = Number(context.req.param('coreNo'));

  if (prjNo == null || Number.isNaN(coreNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, coreNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await CoreRuleService.getByNo(prjNo, coreNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 코어 설정 생성.
 * @param context Hono 컨텍스트
 */
coreRules.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = coreRuleSchema.safeParse(raw);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => issue.message)
      .join('; ') || '요청 검증 실패';

    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message,
      },
      200
    );
  }

  const prjNo = parsed.data.prjNo ?? null;
  if (prjNo == null || !Number.isInteger(prjNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: 'prjNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const coreNm = (parsed.data.coreNm ?? '').toString().trim();
  if (!coreNm) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: 'coreNm은 필수이며 비어 있을 수 없습니다.',
      },
      200
    );
  }

  const result = await CoreRuleService.create(prjNo, parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 코어 설정 수정.
 * @param context Hono 컨텍스트
 */
coreRules.patch('/:coreNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const coreNo = Number(context.req.param('coreNo'));

  if (prjNo == null || Number.isNaN(coreNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, coreNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = coreRuleSchema.partial().safeParse(raw);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => issue.message)
      .join('; ') || '요청 검증 실패';

    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message,
      },
      200
    );
  }

  const result = await CoreRuleService.update(prjNo, coreNo, parsed.data ?? {});

  return context.json(
    result,
    200
  );
});

/**
 * @description 코어 설정 삭제.
 * @param context Hono 컨텍스트
 */
coreRules.delete('/:coreNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const coreNo = Number(context.req.param('coreNo'));

  if (prjNo == null || Number.isNaN(coreNo)) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, coreNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await CoreRuleService.delete(prjNo, coreNo);

  return context.json(
    result,
    200
  );
});

export { coreRules as CoreRuleController };
