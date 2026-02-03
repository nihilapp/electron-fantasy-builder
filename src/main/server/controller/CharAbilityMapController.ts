import { Hono } from 'hono';

import type { CharAbilityMapVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { abilityTypeEnum, charAbilityMapSchema } from '@zod-schema/charAbilityMap.schema';

import { CharAbilityMapService } from '../service/CharAbilityMapService';

/**
 * @description 인물-어빌리티 매핑 API 컨트롤러. /char-ability-maps 마운트.
 */
const charAbilityMaps = new Hono();

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
 * @description 인물-어빌리티 매핑 목록 조회.
 * @param context Hono 컨텍스트
 */
charAbilityMaps.get('/', async (context) => {
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

  const body = await CharAbilityMapService.getList(charNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 인물-어빌리티 매핑 단건 조회.
 * @param context Hono 컨텍스트
 */
charAbilityMaps.get('/one', async (context) => {
  const charNo = parseNum(context.req.query('charNo'));
  const abilityNo = parseNum(context.req.query('abilityNo'));
  const abilityType = context.req.query('abilityType');

  if (charNo == null || abilityNo == null || !abilityType || !abilityTypeEnum.safeParse(abilityType).success) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'charNo, abilityNo, abilityType(GLOBAL|PROJECT)는 필수입니다.',
      },
      200
    );
  }

  const body = await CharAbilityMapService.getOne(charNo, abilityNo, abilityType);

  return context.json(
    body,
    200
  );
});

/**
 * @description 인물-어빌리티 매핑 생성.
 * @param context Hono 컨텍스트
 */
charAbilityMaps.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = charAbilityMapSchema.safeParse(raw);

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

  const result = await CharAbilityMapService.create(parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 인물-어빌리티 매핑 수정.
 * @param context Hono 컨텍스트
 */
charAbilityMaps.patch('/', async (context) => {
  const charNo = parseNum(context.req.query('charNo'));
  const abilityNo = parseNum(context.req.query('abilityNo'));
  const abilityType = context.req.query('abilityType');

  if (charNo == null || abilityNo == null || !abilityType || !abilityTypeEnum.safeParse(abilityType).success) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'charNo, abilityNo, abilityType(GLOBAL|PROJECT)는 필수입니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = charAbilityMapSchema.partial().safeParse(raw);

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

  const result = await CharAbilityMapService.update(
    charNo,
    abilityNo,
    abilityType,
    parsed.data ?? {} as Partial<CharAbilityMapVo>
  );

  return context.json(
    result,
    200
  );
});

/**
 * @description 인물-어빌리티 매핑 삭제.
 * @param context Hono 컨텍스트
 */
charAbilityMaps.delete('/', async (context) => {
  const charNo = parseNum(context.req.query('charNo'));
  const abilityNo = parseNum(context.req.query('abilityNo'));
  const abilityType = context.req.query('abilityType');

  if (charNo == null || abilityNo == null || !abilityType || !abilityTypeEnum.safeParse(abilityType).success) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'charNo, abilityNo, abilityType(GLOBAL|PROJECT)는 필수입니다.',
      },
      200
    );
  }

  const result = await CharAbilityMapService.delete(charNo, abilityNo, abilityType);

  return context.json(
    result,
    200
  );
});

export { charAbilityMaps as CharAbilityMapController };
