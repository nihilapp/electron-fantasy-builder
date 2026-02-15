import { Hono } from 'hono';

import type { ItemVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { itemSchema } from '@zod-schema/item.schema';

import { ItemService } from './ItemService';

/**
 * @description 아이템 API 컨트롤러. /items 마운트. prjNo는 쿼리(GET/PATCH/DELETE) 또는 바디(POST)로 전달.
 */
const items = new Hono();

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
 * @description 아이템 목록 조회.
 * @param context Hono 컨텍스트
 */
items.get('/', async (context) => {
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
  const params = itemSchema.parse({
    ...query,
    prjNo,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await ItemService.getList(prjNo, params);

  return context.json(
    body,
    200
  );
});

/**
 * @description 아이템 상세 조회.
 * @param context Hono 컨텍스트
 */
items.get('/:itemNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const itemNo = Number(context.req.param('itemNo'));
  if (prjNo == null || Number.isNaN(itemNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, itemNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await ItemService.getByNo(prjNo, itemNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 아이템 생성.
 * @param context Hono 컨텍스트
 */
items.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = itemSchema.safeParse(raw);
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

  const itemNm = (parsed.data.itemNm ?? '').toString().trim();
  if (!itemNm) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: 'itemNm은 필수이며 비어 있을 수 없습니다.',
      },
      200
    );
  }

  const result = await ItemService.create(prjNo, parsed.data);

  return context.json(
    result,
    200
  );
});

/**
 * @description 아이템 수정.
 * @param context Hono 컨텍스트
 */
items.patch('/:itemNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const itemNo = Number(context.req.param('itemNo'));
  if (prjNo == null || Number.isNaN(itemNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, itemNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = itemSchema.partial().safeParse(raw);

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

  const result = await ItemService.update(
    prjNo,
    itemNo,
    parsed.data ?? {} as Partial<ItemVo>
  );

  return context.json(
    result,
    200
  );
});

/**
 * @description 아이템 삭제.
 * @param context Hono 컨텍스트
 */
items.delete('/:itemNo', async (context) => {
  const prjNo = parsePrjNo(context.req.query('prjNo'));
  const itemNo = Number(context.req.param('itemNo'));
  if (prjNo == null || Number.isNaN(itemNo)) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo, itemNo는 필수이며 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await ItemService.delete(prjNo, itemNo);

  return context.json(
    result,
    200
  );
});

export { items as ItemController };
