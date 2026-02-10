/**
 * 공용 VO (Value Object).
 * - CommonVo, SearchVo: 레거시/호환용 인터페이스.
 * - ProjectVo: projectSchema(ProjectType)와 동일. 요청/응답 TData에 사용.
 */

import { z } from 'zod';

import type { searchSchema } from '@zod-schema/search.schema';

import type { abilitySchema } from '../zod-schema/ability.schema';
import type { charAbilityMapSchema } from '../zod-schema/charAbilityMap.schema';
import type { characterSchema } from '../zod-schema/character.schema';
import type { charTraitMapSchema } from '../zod-schema/charTraitMap.schema';
import type { coreRuleListItemSchema, coreRuleSchema } from '../zod-schema/coreRule.schema';
import type { creatureSchema } from '../zod-schema/creature.schema';
import type { creatureAbilityMapSchema } from '../zod-schema/creatureAbilityMap.schema';
import type { creatureTraitMapSchema } from '../zod-schema/creatureTraitMap.schema';
import type { eventSchema } from '../zod-schema/event.schema';
import type { itemSchema } from '../zod-schema/item.schema';
import type { loreSchema } from '../zod-schema/lore.schema';
import type { nationSchema } from '../zod-schema/nation.schema';
import type { organizationSchema } from '../zod-schema/organization.schema';
import type { projectSchema } from '../zod-schema/project.schema';
import type { projectAbilitySchema } from '../zod-schema/projectAbility.schema';
import type { projectTraitSchema } from '../zod-schema/projectTrait.schema';
import type { regionSchema } from '../zod-schema/region.schema';
import type { settingsSearchParamsSchema, unifiedSettingItemSchema } from '../zod-schema/settingsSearch.schema';
import type { traitSchema } from '../zod-schema/trait.schema';

export type SearchVo = z.infer<typeof searchSchema>;

/** 프로젝트 VO. projectSchema(ProjectType)와 동일. 컨트롤러 요청/응답 TData에 사용. */
export type ProjectVo = z.infer<typeof projectSchema>;

/** 트레잇 VO. traitSchema와 동일. */
export type TraitVo = z.infer<typeof traitSchema>;

/** 프로젝트 종속 특성 VO. projectTraitSchema와 동일. */
export type ProjectTraitVo = z.infer<typeof projectTraitSchema>;

/** 어빌리티 VO. abilitySchema와 동일. */
export type AbilityVo = z.infer<typeof abilitySchema>;

/** 프로젝트 종속 어빌리티 VO. projectAbilitySchema와 동일. */
export type ProjectAbilityVo = z.infer<typeof projectAbilitySchema>;

/** 코어 설정 VO. coreRuleSchema와 동일. */
export type CoreRuleVo = z.infer<typeof coreRuleSchema>;

/** 코어 설정 목록 항목 VO. 목록 API 응답용(메타+이름만). */
export type CoreRuleListItemVo = z.infer<typeof coreRuleListItemSchema>;

/** 생물/종족 VO. creatureSchema와 동일. */
export type CreatureVo = z.infer<typeof creatureSchema>;

/** 인물 VO. characterSchema와 동일. */
export type CharacterVo = z.infer<typeof characterSchema>;

/** 아이템 VO. itemSchema와 동일. */
export type ItemVo = z.infer<typeof itemSchema>;

/** 지역 VO. regionSchema와 동일. */
export type RegionVo = z.infer<typeof regionSchema>;

/** 국가 VO. nationSchema와 동일. */
export type NationVo = z.infer<typeof nationSchema>;

/** 조직 VO. organizationSchema와 동일. */
export type OrganizationVo = z.infer<typeof organizationSchema>;

/** 사건 VO. eventSchema와 동일. */
export type EventVo = z.infer<typeof eventSchema>;

/** 전승/설화 VO. loreSchema와 동일. */
export type LoreVo = z.infer<typeof loreSchema>;

/** 인물-특성 매핑 VO. charTraitMapSchema와 동일. */
export type CharTraitMapVo = z.infer<typeof charTraitMapSchema>;

/** 인물-어빌리티 매핑 VO. charAbilityMapSchema와 동일. */
export type CharAbilityMapVo = z.infer<typeof charAbilityMapSchema>;

/** 종족-특성 매핑 VO. creatureTraitMapSchema와 동일. */
export type CreatureTraitMapVo = z.infer<typeof creatureTraitMapSchema>;

/** 종족-어빌리티 매핑 VO. creatureAbilityMapSchema와 동일. */
export type CreatureAbilityMapVo = z.infer<typeof creatureAbilityMapSchema>;

/** 통합 설정 검색 결과 한 항목 VO. GET /settings/search 응답 list 항목. */
export type UnifiedSettingItemVo = z.infer<typeof unifiedSettingItemSchema>;

/** 통합 설정 검색 쿼리 파라미터. */
export type SettingsSearchParamsVo = z.infer<typeof settingsSearchParamsSchema>;
