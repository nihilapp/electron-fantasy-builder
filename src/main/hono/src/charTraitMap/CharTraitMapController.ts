import { Hono } from 'hono';

import type { CharTraitMapVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { charTraitMapSchema, traitTypeEnum } from '@zod-schema/charTraitMap.schema';

import { CharTraitMapService } from './CharTraitMapService';

/**
 * @description 인물-특성 매핑 API 컨트롤러. /char-trait-maps 마운트. 목록/단건: charNo(필수), 단건: traitNo, traitType.
 */
const charTraitMaps = new Hono();

/**
 * @description 쿼리 문자열을 숫자로 파싱. 유효하지 않으면 null.
 * @param raw 숫자 문자열
 */
function parseNum(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

/**
 * @description 인물-특성 매핑 목록 조회.
 * @param context Hono 컨텍스트
 */
charTraitMaps.get('/', async (context) => {
  const charNo = parseNum(context.req.query('charNo'));

  if (charNo == null) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'charNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await CharTraitMapService.getList(charNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 인물-특성 매핑 단건 조회.
 * @param context Hono 컨텍스트
 */
charTraitMaps.get('/one', async (context) => {
  const charNo = parseNum(context.req.query('charNo'));
  const traitNo = parseNum(context.req.query('traitNo'));
  const traitType = context.req.query('traitType');

  if (charNo == null || traitNo == null || !traitType || !traitTypeEnum.safeParse(traitType).success) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'charNo, traitNo, traitType(GLOBAL|PROJECT)는 필수입니다.',
      },
      200
    );
  }

  const body = await CharTraitMapService.getOne(charNo, traitNo, traitType);

  return context.json(
    body,
    200
  );
});

/**
 * @description 인물-특성 매핑 생성.
 * @param context Hono 컨텍스트
 */
charTraitMaps.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = charTraitMapSchema.safeParse(raw);

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

  const result = await CharTraitMapService.create(parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 인물-특성 매핑 수정.
 * @param context Hono 컨텍스트
 */
charTraitMaps.patch('/', async (context) => {
  const charNo = parseNum(context.req.query('charNo'));
  const traitNo = parseNum(context.req.query('traitNo'));
  const traitType = context.req.query('traitType');

  if (charNo == null || traitNo == null || !traitType || !traitTypeEnum.safeParse(traitType).success) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'charNo, traitNo, traitType(GLOBAL|PROJECT)는 필수입니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = charTraitMapSchema.partial().safeParse(raw);

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

  const result = await CharTraitMapService.update(
    charNo,
    traitNo,
    traitType,
    parsed.data ?? {} as Partial<CharTraitMapVo>
  );

  return context.json(
    result,
    200
  );
});

/**
 * @description 인물-특성 매핑 삭제.
 * @param context Hono 컨텍스트
 */
charTraitMaps.delete('/', async (context) => {
  const charNo = parseNum(context.req.query('charNo'));
  const traitNo = parseNum(context.req.query('traitNo'));
  const traitType = context.req.query('traitType');

  if (charNo == null || traitNo == null || !traitType || !traitTypeEnum.safeParse(traitType).success) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'charNo, traitNo, traitType(GLOBAL|PROJECT)는 필수입니다.',
      },
      200
    );
  }

  const result = await CharTraitMapService.delete(charNo, traitNo, traitType);

  return context.json(
    result,
    200
  );
});

export { charTraitMaps as CharTraitMapController };
