import { Hono } from 'hono';

import { RESPONSE_CODE } from '@constants/response-code.const';
import { projectAbilitySchema } from '@zod-schema/projectAbility.schema';

import { ProjectAbilityService } from '../service/ProjectAbilityService';

/**
 * @description 프로젝트 종속 어빌리티 API 컨트롤러. /project-abilities 마운트. prjNo는 쿼리(GET/PATCH/DELETE) 또는 바디(POST)로 전달.
 */
const projectAbilities = new Hono();

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
 * @description 프로젝트 종속 어빌리티 목록 조회.
 * @param context Hono 컨텍스트
 */
projectAbilities.get('/', async (context) => {
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
  const params = projectAbilitySchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await ProjectAbilityService.getList(prjNo, params);

  return context.json(
    body,
    200
  );
});

/**
 * @description 프로젝트 종속 어빌리티 상세 조회.
 * @param context Hono 컨텍스트
 */
projectAbilities.get('/:abilityNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const abilityNo = Number(context.req.param('abilityNo'));

  if (prjNo == null || Number.isNaN(abilityNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, abilityNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await ProjectAbilityService.getByNo(prjNo, abilityNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 프로젝트 종속 어빌리티 생성.
 * @param context Hono 컨텍스트
 */
projectAbilities.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = projectAbilitySchema.safeParse(raw);

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

  const abilityNm = (parsed.data.abilityNm ?? '').toString().trim();
  if (!abilityNm) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: 'abilityNm은 필수이며 비어 있을 수 없습니다.',
      },
      200
    );
  }

  const result = await ProjectAbilityService.create(prjNo, parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 프로젝트 종속 어빌리티 수정.
 * @param context Hono 컨텍스트
 */
projectAbilities.patch('/:abilityNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const abilityNo = Number(context.req.param('abilityNo'));

  if (prjNo == null || Number.isNaN(abilityNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, abilityNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = projectAbilitySchema.partial().safeParse(raw);

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

  const result = await ProjectAbilityService.update(prjNo, abilityNo, parsed.data ?? {});

  return context.json(
    result,
    200
  );
});

/**
 * @description 프로젝트 종속 어빌리티 삭제.
 * @param context Hono 컨텍스트
 */
projectAbilities.delete('/:abilityNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const abilityNo = Number(context.req.param('abilityNo'));

  if (prjNo == null || Number.isNaN(abilityNo)) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, abilityNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await ProjectAbilityService.delete(prjNo, abilityNo);

  return context.json(
    result,
    200
  );
});

export { projectAbilities as ProjectAbilityController };
