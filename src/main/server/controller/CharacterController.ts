import { Hono } from 'hono';

import type { CharacterVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { characterSchema } from '@zod-schema/character.schema';

import { CharacterService } from '../service/CharacterService';

/** /characters. prjNo: 쿼리(GET/PATCH/DELETE) 또는 바디(POST). */
const characters = new Hono();

function parsePrjNo(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
}

characters.get('/', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  if (prjNo == null) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo는 필수이며 숫자여야 합니다.', }, 200);
  const query = c.req.query();
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
  return c.json(await CharacterService.getList(prjNo, params), 200);
});

characters.get('/:charNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const charNo = Number(c.req.param('charNo'));
  if (prjNo == null || Number.isNaN(charNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, charNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await CharacterService.getByNo(prjNo, charNo), 200);
});

characters.post('/', async (c) => {
  const raw = await c.req.json();
  const parsed = characterSchema.safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  const prjNo = parsed.data.prjNo ?? null;
  if (prjNo == null || !Number.isInteger(prjNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: 'prjNo는 필수이며 숫자여야 합니다.', }, 200);
  const charNm = (parsed.data.charNm ?? '').toString().trim();
  if (!charNm) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: 'charNm은 필수이며 비어 있을 수 없습니다.', }, 200);
  return c.json(await CharacterService.create(prjNo, parsed.data), 200);
});

characters.patch('/:charNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const charNo = Number(c.req.param('charNo'));
  if (prjNo == null || Number.isNaN(charNo)) return c.json({ data: null, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, charNo는 필수이며 숫자여야 합니다.', }, 200);
  const raw = await c.req.json();
  const parsed = characterSchema.partial().safeParse(raw);
  if (!parsed.success) return c.json({ data: null, error: true, code: RESPONSE_CODE.VALIDATION_ERROR, message: parsed.error.issues.map((i) => i.message).join('; ') || '요청 검증 실패', }, 200);
  return c.json(await CharacterService.update(prjNo, charNo, parsed.data ?? {} as Partial<CharacterVo>), 200);
});

characters.delete('/:charNo', async (c) => {
  const prjNo = parsePrjNo(c.req.query('prjNo'));
  const charNo = Number(c.req.param('charNo'));
  if (prjNo == null || Number.isNaN(charNo)) return c.json({ data: { deleted: false, }, error: true, code: RESPONSE_CODE.BAD_REQUEST, message: 'prjNo, charNo는 필수이며 숫자여야 합니다.', }, 200);
  return c.json(await CharacterService.delete(prjNo, charNo), 200);
});

export { characters as CharacterController };
