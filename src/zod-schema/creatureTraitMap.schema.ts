/**
 * 종족-특성 매핑 VO용 Zod 스키마.
 * creature_trait_maps 테이블. PK: map_no.
 */

import { z } from 'zod';

import { traitTypeEnum } from './charTraitMap.schema';

export const creatureTraitMapSchema = z.object({
  mapNo: z.number().int().nullable().optional().default(null),
  creatureNo: z.number().int(),
  traitNo: z.number().int(),
  traitType: traitTypeEnum,
  traitRmk: z.string().nullable().optional().default(null),
});

export type CreatureTraitMapSchema = z.infer<typeof creatureTraitMapSchema>;
