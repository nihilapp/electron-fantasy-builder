import { Hono } from 'hono';

import type { CreatureAbilityMapVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { creatureAbilityMapSchema } from '@zod-schema/creatureAbilityMap.schema';

import { CreatureAbilityMapService } from './CreatureAbilityMapService';

/**
 * @description 종족-어빌리티 매핑 API 컨트롤러. /creature-ability-maps 마운트.
 */
const creatureAbilityMaps = new Hono();

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
 * @description 종족-어빌리티 매핑 목록 조회.
 * @param context Hono 컨텍스트
 */
creatureAbilityMaps.get('/', async (context) => {
  const creatureNo = parseNum(context.req.query('creatureNo'));

  if (creatureNo == null) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'creatureNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await CreatureAbilityMapService.getList(creatureNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 종족-어빌리티 매핑 단건 조회.
 * @param context Hono 컨텍스트
 */
creatureAbilityMaps.get('/:mapNo', async (context) => {
  const mapNo = parseNum(context.req.param('mapNo'));

  if (mapNo == null) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'mapNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await CreatureAbilityMapService.getByMapNo(mapNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 종족-어빌리티 매핑 생성.
 * @param context Hono 컨텍스트
 */
creatureAbilityMaps.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = creatureAbilityMapSchema.safeParse(raw);

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

  const result = await CreatureAbilityMapService.create(parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 종족-어빌리티 매핑 수정.
 * @param context Hono 컨텍스트
 */
creatureAbilityMaps.patch('/:mapNo', async (context) => {
  const mapNo = parseNum(context.req.param('mapNo'));

  if (mapNo == null) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'mapNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = creatureAbilityMapSchema.partial().safeParse(raw);

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

  const result = await CreatureAbilityMapService.update(
    mapNo,
    parsed.data ?? {} as Partial<CreatureAbilityMapVo>
  );

  return context.json(
    result,
    200
  );
});

/**
 * @description 종족-어빌리티 매핑 삭제.
 * @param context Hono 컨텍스트
 */
creatureAbilityMaps.delete('/:mapNo', async (context) => {
  const mapNo = parseNum(context.req.param('mapNo'));

  if (mapNo == null) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'mapNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await CreatureAbilityMapService.delete(mapNo);

  return context.json(
    result,
    200
  );
});

export { creatureAbilityMaps as CreatureAbilityMapController };
