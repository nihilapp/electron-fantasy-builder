import { Hono } from 'hono';

import type { CreatureTraitMapVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { creatureTraitMapSchema } from '@zod-schema/creatureTraitMap.schema';

import { CreatureTraitMapService } from '../service/CreatureTraitMapService';

/**
 * @description 종족-특성 매핑 API 컨트롤러. /creature-trait-maps 마운트. 목록: ?creatureNo=, 단건: /:mapNo.
 */
const creatureTraitMaps = new Hono();

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
 * @description 종족-특성 매핑 목록 조회.
 * @param context Hono 컨텍스트
 */
creatureTraitMaps.get('/', async (context) => {
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

  const body = await CreatureTraitMapService.getList(creatureNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 종족-특성 매핑 단건 조회.
 * @param context Hono 컨텍스트
 */
creatureTraitMaps.get('/:mapNo', async (context) => {
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

  const body = await CreatureTraitMapService.getByMapNo(mapNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 종족-특성 매핑 생성.
 * @param context Hono 컨텍스트
 */
creatureTraitMaps.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = creatureTraitMapSchema.safeParse(raw);

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

  const result = await CreatureTraitMapService.create(parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 종족-특성 매핑 수정.
 * @param context Hono 컨텍스트
 */
creatureTraitMaps.patch('/:mapNo', async (context) => {
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
  const parsed = creatureTraitMapSchema.partial().safeParse(raw);

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

  const result = await CreatureTraitMapService.update(
    mapNo,
    parsed.data ?? {} as Partial<CreatureTraitMapVo>
  );

  return context.json(
    result,
    200
  );
});

/**
 * @description 종족-특성 매핑 삭제.
 * @param context Hono 컨텍스트
 */
creatureTraitMaps.delete('/:mapNo', async (context) => {
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

  const result = await CreatureTraitMapService.delete(mapNo);

  return context.json(
    result,
    200
  );
});

export { creatureTraitMaps as CreatureTraitMapController };
