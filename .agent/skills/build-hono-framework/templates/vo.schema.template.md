
```typescript
/**
 * __Entity__ VO Schema
 */
import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** __Entity__ VO Schema. Nullable/Optional by default. */
export const __entity__Schema = z.object({
  __entity__No: z.number().int().nullable().optional().default(null),
  // __entity__Nm: z.string().nullable().optional().default(null),
})
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmpty__Entity__ = () => __entity__Schema.parse({});
```
