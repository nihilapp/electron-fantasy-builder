/**
 * RefactorTest VO Schema
 */
import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** RefactorTest VO Schema. Nullable/Optional by default. */
export const refactorTestSchema = z.object({
  refactorTestNo: z.number().int().nullable().optional().default(null),
  // refactorTestNm: z.string().nullable().optional().default(null),
})
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmptyRefactorTest = () => refactorTestSchema.parse({});
