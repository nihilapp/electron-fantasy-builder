import { Hono } from 'hono';

import type { EventVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { eventSchema } from '@zod-schema/event.schema';

import { EventService } from '../service/EventService';

/**
 * @description 사건 API 컨트롤러. /events 마운트. prjNo는 쿼리(GET/PATCH/DELETE) 또는 바디(POST)로 전달.
 */
const events = new Hono();

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
 * @description 사건 목록 조회.
 * @param context Hono 컨텍스트
 */
events.get('/', async (context) => {
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
  const params = eventSchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await EventService.getList(prjNo, params);

  return context.json(
    body,
    200
  );
});

/**
 * @description 사건 상세 조회.
 * @param context Hono 컨텍스트
 */
events.get('/:eventNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const eventNo = Number(context.req.param('eventNo'));

  if (prjNo == null || Number.isNaN(eventNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, eventNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await EventService.getByNo(prjNo, eventNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 사건 생성.
 * @param context Hono 컨텍스트
 */
events.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = eventSchema.safeParse(raw);

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

  const eventNm = (parsed.data.eventNm ?? '').toString().trim();
  if (!eventNm) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: 'eventNm은 필수이며 비어 있을 수 없습니다.',
      },
      200
    );
  }

  const result = await EventService.create(prjNo, parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 사건 수정.
 * @param context Hono 컨텍스트
 */
events.patch('/:eventNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const eventNo = Number(context.req.param('eventNo'));

  if (prjNo == null || Number.isNaN(eventNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, eventNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = eventSchema.partial().safeParse(raw);

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

  const result = await EventService.update(
    prjNo,
    eventNo,
    parsed.data ?? {} as Partial<EventVo>
  );

  return context.json(
    result,
    200
  );
});

/**
 * @description 사건 삭제.
 * @param context Hono 컨텍스트
 */
events.delete('/:eventNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const eventNo = Number(context.req.param('eventNo'));

  if (prjNo == null || Number.isNaN(eventNo)) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, eventNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await EventService.delete(prjNo, eventNo);

  return context.json(
    result,
    200
  );
});

export { events as EventController };
