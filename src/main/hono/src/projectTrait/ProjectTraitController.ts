import { Hono } from 'hono';

import { RESPONSE_CODE } from '@constants/response-code.const';
import { projectTraitSchema } from '@zod-schema/projectTrait.schema';

import { ProjectTraitService } from './ProjectTraitService';

/**
 * @description 프로젝트 종속 특성 API 컨트롤러. /project-traits 마운트. prjNo는 쿼리(GET/PATCH/DELETE) 또는 바디(POST)로 전달.
 */
const projectTraits = new Hono();

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
 * @description 프로젝트 종속 특성 목록 조회.
 * @param context Hono 컨텍스트
 */
projectTraits.get('/', async (context) => {
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
  const params = projectTraitSchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await ProjectTraitService.getList(prjNo, params);

  return context.json(
    body,
    200
  );
});

/**
 * @description 프로젝트 종속 특성 상세 조회.
 * @param context Hono 컨텍스트
 */
projectTraits.get('/:traitNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const traitNo = Number(context.req.param('traitNo'));

  if (prjNo == null || Number.isNaN(traitNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, traitNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await ProjectTraitService.getByNo(prjNo, traitNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 프로젝트 종속 특성 생성.
 * @param context Hono 컨텍스트
 */
projectTraits.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = projectTraitSchema.safeParse(raw);

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

  const traitNm = (parsed.data.traitNm ?? '').toString().trim();
  if (!traitNm) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: 'traitNm은 필수이며 비어 있을 수 없습니다.',
      },
      200
    );
  }

  const result = await ProjectTraitService.create(prjNo, parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 프로젝트 종속 특성 수정.
 * @param context Hono 컨텍스트
 */
projectTraits.patch('/:traitNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const traitNo = Number(context.req.param('traitNo'));

  if (prjNo == null || Number.isNaN(traitNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, traitNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = projectTraitSchema.partial().safeParse(raw);

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

  const result = await ProjectTraitService.update(prjNo, traitNo, parsed.data ?? {});

  return context.json(
    result,
    200
  );
});

/**
 * @description 프로젝트 종속 특성 삭제.
 * @param context Hono 컨텍스트
 */
projectTraits.delete('/:traitNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const traitNo = Number(context.req.param('traitNo'));

  if (prjNo == null || Number.isNaN(traitNo)) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, traitNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await ProjectTraitService.delete(prjNo, traitNo);

  return context.json(
    result,
    200
  );
});

export { projectTraits as ProjectTraitController };
