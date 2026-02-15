
```typescript
import { Hono } from 'hono';

import type { __Entity__Vo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { __entity__Schema } from '@zod-schema/__entity__.schema';

import { __Entity__Service } from './__Entity__Service';

/**
 * @description __Entity__ API Controller.
 * GET/POST/PATCH/DELETE /__entity__s
 */
const __entity__s = new Hono();

/**
 * @description List __Entity__ (Paging, Search)
 */
__entity__s.get('/', async (context) => {
  const query = context.req.query();

  const params = __entity__Schema.parse({
    ...query,
    page: query.page ? Number(query.page) : null,
    pageSize: query.pageSize ? Number(query.pageSize) : null,
  });

  const body = await __Entity__Service.getList(params);

  return context.json(body, 200);
});

/**
 * @description Get __Entity__ by No
 */
__entity__s.get('/:__entity__No', async (context) => {
  const __entity__No = Number(context.req.param('__entity__No'));

  if (Number.isNaN(__entity__No)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: '__entity__No must be a number.',
      },
      200
    );
  }

  const body = await __Entity__Service.getByNo(__entity__No);

  return context.json(body, 200);
});

/**
 * @description Create __Entity__
 */
__entity__s.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = __entity__Schema.safeParse(raw);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => issue.message)
      .join('; ') || 'Validation failed';

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

  const result = await __Entity__Service.create(parsed.data);

  return context.json(result, 200);
});

/**
 * @description Update __Entity__
 */
__entity__s.patch('/:__entity__No', async (context) => {
  const __entity__No = Number(context.req.param('__entity__No'));

  if (Number.isNaN(__entity__No)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: '__entity__No must be a number.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = __entity__Schema.partial().safeParse(raw);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => issue.message)
      .join('; ') || 'Validation failed';

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

  const result = await __Entity__Service.update(__entity__No, parsed.data as Partial<__Entity__Vo>);

  return context.json(result, 200);
});

/**
 * @description Delete __Entity__ (Soft Delete)
 */
__entity__s.delete('/:__entity__No', async (context) => {
  const __entity__No = Number(context.req.param('__entity__No'));

  if (Number.isNaN(__entity__No)) {
    return context.json(
      {
        data: { deleted: false },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: '__entity__No must be a number.',
      },
      200
    );
  }

  const result = await __Entity__Service.delete(__entity__No);

  return context.json(result, 200);
});

export { __entity__s as __Entity__Controller };
```
