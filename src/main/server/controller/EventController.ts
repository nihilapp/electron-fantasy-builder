import { Hono } from 'hono';

import type { EventVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { eventSchema } from '@zod-schema/event.schema';

import { EventService } from '../service/EventService';

const events = new Hono();

function parsePrjNo(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

events.get('/', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  if (prjNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo는 필수이며 숫자여야 합니다.', }, 200);
  const query = c.req.query();
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
  return c.json(await EventService.getList(prjNo, params), 200);
});

events.get('/:eventNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const eventNo = Number(c.req.param('eventNo'));
  if (prjNo == null || Number.isNaN(eventNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, eventNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await EventService.getByNo(prjNo, eventNo), 200);
});

events.post('/', async (c) => {
  const raw = await c.req.json();
  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  const prjNo = parsed.data.prjNo ?? null;
  if (prjNo == null || !Number.isInteger(prjNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: 'prjNo는 필수이며 숫자여야 합니다.', }, 200);
  const eventNm = (parsed.data.eventNm ?? '').toString().trim();
  if (!eventNm) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: 'eventNm은 필수이며 비어 있을 수 없습니다.', }, 200);
  return c.json(await EventService.create(prjNo, parsed.data), 200);
});

events.patch('/:eventNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const eventNo = Number(c.req.param('eventNo'));
  if (prjNo == null || Number.isNaN(eventNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, eventNo는 필수이며 숫자여야 합니다.', }, 200);
  const raw = await c.req.json();
  const parsed = eventSchema.partial().safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await EventService.update(prjNo, eventNo, parsed.data ?? {} as Partial<EventVo>), 200);
});

events.delete('/:eventNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const eventNo = Number(c.req.param('eventNo'));
  if (prjNo == null || Number.isNaN(eventNo)) return c.json({ data: { deleted: false, }, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, eventNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await EventService.delete(prjNo, eventNo), 200);
});

export { events as EventController };
