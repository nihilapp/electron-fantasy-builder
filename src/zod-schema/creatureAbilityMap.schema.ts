/**
 * 종족-어빌리티 매핑 VO용 Zod 스키마.
 * creature_ability_maps 테이블. PK: map_no.
 */

import { z } from 'zod';

import { abilityTypeEnum } from './charAbilityMap.schema';

export const creatureAbilityMapSchema = z.object({
  mapNo: z.number().int().nullable().optional().default(null),
  creatureNo: z.number().int(),
  abilityNo: z.number().int(),
  abilityType: abilityTypeEnum,
  profLvl: z.number().int().nullable().optional().default(null),
  abilityRmk: z.string().nullable().optional().default(null),
});

export type CreatureAbilityMapSchema = z.infer<typeof creatureAbilityMapSchema>;
