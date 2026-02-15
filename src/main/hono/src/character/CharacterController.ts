import { Hono } from 'hono';

import type { CharacterVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { characterSchema } from '@zod-schema/character.schema';

import { CharacterService } from './CharacterService';

/**
 * @description 인물 API 컨트롤러. /characters 마운트. prjNo는 쿼리(GET/PATCH/DELETE) 또는 바디(POST)로 전달.
 */
const characters = new Hono();

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
 * @description 인물 목록 조회.
 * @param context Hono 컨텍스트
 */
characters.get('/', async (context) => {
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
  const params = characterSchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await CharacterService.getList(prjNo, params);

  return context.json(
    body,
    200
  );
});

/**
 * @description 인물 상세 조회.
 * @param context Hono 컨텍스트
 */
characters.get('/:charNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const charNo = Number(context.req.param('charNo'));

  if (prjNo == null || Number.isNaN(charNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, charNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await CharacterService.getByNo(prjNo, charNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 인물 생성.
 * @param context Hono 컨텍스트
 */
characters.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = characterSchema.safeParse(raw);

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

  const charNm = (parsed.data.charNm ?? '').toString().trim();
  if (!charNm) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: 'charNm은 필수이며 비어 있을 수 없습니다.',
      },
      200
    );
  }

  const result = await CharacterService.create(prjNo, parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 인물 수정.
 * @param context Hono 컨텍스트
 */
characters.patch('/:charNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const charNo = Number(context.req.param('charNo'));

  if (prjNo == null || Number.isNaN(charNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, charNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = characterSchema.partial().safeParse(raw);

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

  const result = await CharacterService.update(
    prjNo,
    charNo,
    parsed.data ?? {} as Partial<CharacterVo>
  );

  return context.json(
    result,
    200
  );
});

/**
 * @description 인물 삭제.
 * @param context Hono 컨텍스트
 */
characters.delete('/:charNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const charNo = Number(context.req.param('charNo'));

  if (prjNo == null || Number.isNaN(charNo)) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, charNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await CharacterService.delete(prjNo, charNo);

  return context.json(
    result,
    200
  );
});

export { characters as CharacterController };
