/**
 * 공용 VO (Value Object).
 * - CommonVo, SearchVo: 레거시/호환용 인터페이스.
 * - ProjectVo: projectSchema(ProjectType)와 동일. 요청/응답 TData에 사용.
 */

import type { searchSchema } from '@zod-schema/search.schema';
import { z } from 'zod';

import type { abilitySchema } from '../zod-schema/ability.schema';
import type { projectSchema } from '../zod-schema/project.schema';
import type { traitSchema } from '../zod-schema/trait.schema';

export type SearchVo = z.infer<typeof searchSchema>;

/** 프로젝트 VO. projectSchema(ProjectType)와 동일. 컨트롤러 요청/응답 TData에 사용. */
export type ProjectVo = z.infer<typeof projectSchema>;

/** 트레잇 VO. traitSchema와 동일. */
export type TraitVo = z.infer<typeof traitSchema>;

/** 어빌리티 VO. abilitySchema와 동일. */
export type AbilityVo = z.infer<typeof abilitySchema>;
