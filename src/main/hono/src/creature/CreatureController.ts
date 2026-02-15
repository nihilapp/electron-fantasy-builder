import { Hono } from 'hono';

import type { CreatureVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { creatureSchema } from '@zod-schema/creature.schema';

import { CreatureService } from './CreatureService';

/**
 * @description 생물/종족 API 컨트롤러. /creatures 마운트. prjNo는 쿼리(GET/PATCH/DELETE) 또는 바디(POST)로 전달.
 */
const creatures = new Hono();

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
 * @description 생물/종족 목록 조회.
 * @param context Hono 컨텍스트
 */
creatures.get('/', async (context) => {
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
  const params = creatureSchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await CreatureService.getList(prjNo, params);

  return context.json(
    body,
    200
  );
});

/**
 * @description 생물/종족 상세 조회.
 * @param context Hono 컨텍스트
 */
creatures.get('/:creatureNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const creatureNo = Number(context.req.param('creatureNo'));

  if (prjNo == null || Number.isNaN(creatureNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, creatureNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await CreatureService.getByNo(prjNo, creatureNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 생물/종족 생성.
 * @param context Hono 컨텍스트
 */
creatures.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = creatureSchema.safeParse(raw);

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

  const creatureNm = (parsed.data.creatureNm ?? '').toString().trim();
  if (!creatureNm) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: 'creatureNm은 필수이며 비어 있을 수 없습니다.',
      },
      200
    );
  }

  const result = await CreatureService.create(prjNo, parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 생물/종족 수정.
 * @param context Hono 컨텍스트
 */
creatures.patch('/:creatureNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const creatureNo = Number(context.req.param('creatureNo'));

  if (prjNo == null || Number.isNaN(creatureNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, creatureNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = creatureSchema.partial().safeParse(raw);

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

  const result = await CreatureService.update(
    prjNo,
    creatureNo,
    parsed.data ?? {} as Partial<CreatureVo>
  );

  return context.json(
    result,
    200
  );
});

/**
 * @description 생물/종족 삭제.
 * @param context Hono 컨텍스트
 */
creatures.delete('/:creatureNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const creatureNo = Number(context.req.param('creatureNo'));

  if (prjNo == null || Number.isNaN(creatureNo)) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, creatureNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await CreatureService.delete(prjNo, creatureNo);

  return context.json(
    result,
    200
  );
});

export { creatures as CreatureController };
