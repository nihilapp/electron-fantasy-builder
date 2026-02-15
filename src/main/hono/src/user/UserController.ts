import { Hono } from 'hono';

import { RESPONSE_CODE } from '@constants/response-code.const';
import { userSchema } from '@zod-schema/user.schema';

import { UserService } from './UserService';

/**
 * @description 사용자 API 컨트롤러.
 */
const users = new Hono();

/**
 * @description 사용자 상세 조회 (내 정보 등).
 */
users.get('/:userNo', async (context) => {
  const userNo = Number(context.req.param('userNo'));

  if (Number.isNaN(userNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'userNo는 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await UserService.getByNo(userNo);

  return context.json(result, 200);
});

/**
 * @description 사용자 생성 (회원가입/테스트).
 */
users.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = userSchema.safeParse(raw);

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

  const result = await UserService.create(parsed.data);

  return context.json(result, 200);
});

export { users as UserController };
