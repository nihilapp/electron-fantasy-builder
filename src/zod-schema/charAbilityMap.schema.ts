/**
 * 인물-어빌리티 매핑 VO용 Zod 스키마.
 * char_ability_maps 테이블. 복합 PK: char_no, ability_no, ability_type.
 */

import { z } from 'zod';

/** GLOBAL | PROJECT */
export const abilityTypeEnum = z.enum([ 'GLOBAL', 'PROJECT', ]);

export const charAbilityMapSchema = z.object({
  charNo: z.number().int(),
  abilityNo: z.number().int(),
  abilityType: abilityTypeEnum,
  profLvl: z.number().int().nullable().optional().default(null),
  abilityRmk: z.string().nullable().optional().default(null),
});

export type CharAbilityMapSchema = z.infer<typeof charAbilityMapSchema>;
