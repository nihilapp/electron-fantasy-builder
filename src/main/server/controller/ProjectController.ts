import { projectSchema } from '@zod-schema/project.schema';
import { Hono } from 'hono';

import type { AppConfig } from '@app-types/config.types';
import appConfig from '@config/app.json';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { ProjectService } from '../service/ProjectService';

const config = appConfig as AppConfig;
const DEFAULT_PAGE_SIZE = config.pagination?.pageSize ?? 10;

/**
 * 프로젝트 API 컨트롤러.
 * 요청은 VO(projectSchema)로 파싱해 처리, 응답 TData에는 VO(ProjectType) 사용.
 * GET /projects, GET /projects/:prjNo, POST /projects, PATCH /projects/:prjNo, DELETE /projects/:prjNo.
 */
const projects = new Hono();

projects.get('/', async (context) => {
  const query = context.req.query();
  const params = projectSchema.parse({
    ...query,
    page: query.page ? Number(query.page) : null,
    pageSize: query.pageSize ? Number(query.pageSize) : null,
  });

  const body = await ProjectService.getList(params);

  return context.json(body, 200);
});

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

  return context.json(body, 200);
});

projects.post('/', async (context) => {
  const raw = await context.req.json();
  const parsed = projectSchema.safeParse(raw);

  if (!parsed.success) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: parsed.error.issues.map((issue) => issue.message).join('; ') || '요청 검증 실패',
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

  return context.json(result, 200);
});

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
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.VALIDATION_ERROR,
        message: parsed.error.issues.map((issue) => issue.message).join('; ') || '요청 검증 실패',
      },
      200
    );
  }

  const result = await ProjectService.update(prjNo, parsed.data ?? {});

  return context.json(result, 200);
});

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

  return context.json(result, 200);
});

export { projects as ProjectController };
