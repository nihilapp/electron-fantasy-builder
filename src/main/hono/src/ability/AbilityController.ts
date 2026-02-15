import { Hono } from 'hono';

import { RESPONSE_CODE } from '@constants/response-code.const';
import { abilitySchema } from '@zod-schema/ability.schema';

import { AbilityService } from './AbilityService';

const abilities = new Hono();

/**
 * @description 어빌리티 목록 조회 (페이징, 검색).
 * @param context Hono 컨텍스트
 */
abilities.get('/', async (context) => {
  const query = context.req.query();

  const params = abilitySchema.parse({
    ...query,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await AbilityService.getList(params);

  return context.json(
    body,
    200
  );
});

/**
 * @description 어빌리티 상세 조회.
 * @param context Hono 컨텍스트
 */
abilities.get('/:abilityNo', async (context) => {
  const abilityNo = Number(context.req.param('abilityNo'));

  if (Number.isNaN(abilityNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'abilityNo는 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await AbilityService.getByNo(abilityNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 어빌리티 생성.
 * @param context Hono 컨텍스트
 */
abilities.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = abilitySchema.safeParse(raw);

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

  const result = await AbilityService.create(parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 어빌리티 수정.
 * @param context Hono 컨텍스트
 */
abilities.patch('/:abilityNo', async (context) => {
  const abilityNo = Number(context.req.param('abilityNo'));

  if (Number.isNaN(abilityNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'abilityNo는 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = abilitySchema.partial().safeParse(raw);

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

  const result = await AbilityService.update(abilityNo, parsed.data ?? {});

  return context.json(
    result,
    200
  );
});

/**
 * @description 어빌리티 삭제.
 * @param context Hono 컨텍스트
 */
abilities.delete('/:abilityNo', async (context) => {
  const abilityNo = Number(context.req.param('abilityNo'));

  if (Number.isNaN(abilityNo)) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'abilityNo는 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await AbilityService.delete(abilityNo);

  return context.json(
    result,
    200
  );
});

export { abilities as AbilityController };
