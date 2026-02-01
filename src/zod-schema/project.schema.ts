/**
 * 프로젝트 VO용 Zod 스키마.
 * projectSchema를 VO 역할로 사용: 요청 시 파싱해 VO 수신, 응답 TData에 VO(ProjectType) 사용.
 * 모든 필드 선택값.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 프로젝트 VO 스키마. 값 없으면 null. */
export const projectSchema = z.object({
  prjNo: z.number().int().nullable().optional().default(null),
  prjNm: z.string().nullable().optional().default(null),
  genreType: z.string().nullable().optional().default(null),
  prjDesc: z.string().nullable().optional().default(null),
  cvrImgUrl: z.string().nullable().optional().default(null),
  prjExpln: z.string().nullable().optional().default(null),
  prjVer: z.string().nullable().optional().default(null),
  userNo: z.number().int().nullable().optional().default(null),
  prjNoList: z.array(z.number().int()).nullable().optional().default(null),
})
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmptyProject = () => projectSchema.parse({});
