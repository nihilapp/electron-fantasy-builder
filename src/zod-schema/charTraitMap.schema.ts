/**
 * 인물-특성 매핑 VO용 Zod 스키마.
 * char_trait_maps 테이블. 복합 PK: char_no, trait_no, trait_type.
 */

import { z } from 'zod';

/** GLOBAL | PROJECT */
export const traitTypeEnum = z.enum([ 'GLOBAL', 'PROJECT', ]);

export const charTraitMapSchema = z.object({
  charNo: z.number().int(),
  traitNo: z.number().int(),
  traitType: traitTypeEnum,
  traitRmk: z.string().nullable().optional().default(null),
});

export type CharTraitMapSchema = z.infer<typeof charTraitMapSchema>;
