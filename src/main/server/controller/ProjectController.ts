import { Hono } from 'hono';

import type { ProjectVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';
import { projectSchema } from '@zod-schema/project.schema';

import { ProjectService } from '../service/ProjectService';

/**
 * @description 프로젝트 API 컨트롤러. 요청은 VO(projectSchema)로 파싱, 응답 TData에 VO(ProjectType) 사용. GET/POST/PATCH/DELETE /projects.
 */
const projects = new Hono();

/**
 * @description 프로젝트 목록 조회 (페이징, 검색).
 * @param context Hono 컨텍스트
 */
projects.get('/', async (context) => {
  const query = context.req.query();

  const params = projectSchema.parse({
    ...query,
    page: query.page
      ? Number(query.page)
      : null,
    pageSize: query.pageSize
      ? Number(query.pageSize)
      : null,
  });

  const body = await ProjectService.getList(params);

  return context.json(
    body,
    200
  );
});

/**
 * @description 프로젝트 상세 조회.
 * @param context Hono 컨텍스트
 */
projects.get('/:prjNo', async (context) => {
  const prjNo = Number(context.req.param('prjNo'));

  if (Number.isNaN(prjNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo는 숫자여야 합니다.',
      },
      200
    );
  }

  const body = await ProjectService.getByNo(prjNo);

  return context.json(
    body,
    200
  );
});

/**
 * @description 프로젝트 생성.
 * @param context Hono 컨텍스트
 */
projects.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = projectSchema.safeParse(raw);

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

  const vo = parsed.data;
  const prjNm = (vo.prjNm ?? '').toString().trim();

  if (!prjNm) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: 'prjNm은 필수이며 비어 있을 수 없습니다.',
      },
      200
    );
  }

  const result = await ProjectService.create(vo);

  return context.json(
    result,
    200
  );
});

/**
 * @description 프로젝트 수정.
 * @param context Hono 컨텍스트
 */
projects.patch('/:prjNo', async (context) => {
  const prjNo = Number(context.req.param('prjNo'));

  if (Number.isNaN(prjNo)) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo는 숫자여야 합니다.',
      },
      200
    );
  }

  const raw = await context.req.json();
  const parsed = projectSchema.partial().safeParse(raw);

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

  const payload = parsed.data ?? {};
  const result = await ProjectService.update(prjNo, payload as Partial<ProjectVo>);

  return context.json(
    result,
    200
  );
});

/**
 * @description 프로젝트 삭제.
 * @param context Hono 컨텍스트
 */
projects.delete('/:prjNo', async (context) => {
  const prjNo = Number(context.req.param('prjNo'));

  if (Number.isNaN(prjNo)) {
    return context.json(
      {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: 'prjNo는 숫자여야 합니다.',
      },
      200
    );
  }

  const result = await ProjectService.delete(prjNo);

  return context.json(
    result,
    200
  );
});

export { projects as ProjectController };
