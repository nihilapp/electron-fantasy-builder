import { Hono } from 'hono';

import { RESPONSE_CODE } from '@constants/response-code.const';
import { traitSchema } from '@zod-schema/trait.schema';

import { TraitService } from '../service/TraitService';

const traits = new Hono();

/**
 * @description 트레잇 목록 조회 (페이징, 검색).
 * @param context Hono 컨텍스트
 */
traits.get('/', async (context) => {
  const query = context.req.query();

  const params = traitSchema.parse({
    ...query,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await TraitService.getList(params);

  return context.json(
    body,
    200
  );
});

/**
 * @description 트레잇 상세 조회.
 * @param context Hono 컨텍스트
 */
traits.get('/:traitNo', async (context) => {
  const traitNo = Number(context.req.param('traitNo'));

  if (Number.isNaN(traitNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'traitNo는 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await TraitService.getByNo(traitNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 트레잇 생성.
 * @param context Hono 컨텍스트
 */
traits.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = traitSchema.safeParse(raw);

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

  const result = await TraitService.create(parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 트레잇 수정.
 * @param context Hono 컨텍스트
 */
traits.patch('/:traitNo', async (context) => {
  const traitNo = Number(context.req.param('traitNo'));

  if (Number.isNaN(traitNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'traitNo는 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = traitSchema.partial().safeParse(raw);

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

  const result = await TraitService.update(traitNo, parsed.data ?? {});

  return context.json(
    result,
    200
  );
});

/**
 * @description 트레잇 삭제.
 * @param context Hono 컨텍스트
 */
traits.delete('/:traitNo', async (context) => {
  const traitNo = Number(context.req.param('traitNo'));

  if (Number.isNaN(traitNo)) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'traitNo는 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await TraitService.delete(traitNo);

  return context.json(
    result,
    200
  );
});

export { traits as TraitController };
