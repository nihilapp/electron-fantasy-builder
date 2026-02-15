import { Hono } from 'hono';

import type { OrganizationVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { organizationSchema } from '@zod-schema/organization.schema';

import { OrganizationService } from './OrganizationService';

/**
 * @description 조직 API 컨트롤러. /organizations 마운트. prjNo는 쿼리(GET/PATCH/DELETE) 또는 바디(POST)로 전달.
 */
const organizations = new Hono();

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
 * @description 조직 목록 조회.
 * @param context Hono 컨텍스트
 */
organizations.get('/', async (context) => {
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

  const body = await OrganizationService.getList(prjNo, params);

  return context.json(
    body,
    200
  );
});

/**
 * @description 조직 상세 조회.
 * @param context Hono 컨텍스트
 */
organizations.get('/:orgNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const orgNo = Number(context.req.param('orgNo'));

  if (prjNo == null || Number.isNaN(orgNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, orgNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await OrganizationService.getByNo(prjNo, orgNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 조직 생성.
 * @param context Hono 컨텍스트
 */
organizations.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = organizationSchema.safeParse(raw);

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

  const orgNm = (parsed.data.orgNm ?? '').toString().trim();
  if (!orgNm) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: 'orgNm은 필수이며 비어 있을 수 없습니다.',
      },
      200
    );
  }

  const result = await OrganizationService.create(prjNo, parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 조직 수정.
 * @param context Hono 컨텍스트
 */
organizations.patch('/:orgNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const orgNo = Number(context.req.param('orgNo'));

  if (prjNo == null || Number.isNaN(orgNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, orgNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = organizationSchema.partial().safeParse(raw);

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

  const result = await OrganizationService.update(
    prjNo,
    orgNo,
    parsed.data ?? {} as Partial<OrganizationVo>
  );

  return context.json(
    result,
    200
  );
});

/**
 * @description 조직 삭제.
 * @param context Hono 컨텍스트
 */
organizations.delete('/:orgNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const orgNo = Number(context.req.param('orgNo'));

  if (prjNo == null || Number.isNaN(orgNo)) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, orgNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await OrganizationService.delete(prjNo, orgNo);

  return context.json(
    result,
    200
  );
});

export { organizations as OrganizationController };
