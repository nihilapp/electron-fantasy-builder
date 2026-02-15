
```typescript
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { commonColumns } from './common.columns';

/**
 * __Entity__ Table (Remote Postgres)
 */
export const __entity__sTable = pgTable('__entity__s', {
  __entity__No: serial('__entity__No').primaryKey(),
  
  // Define columns here
  // __entity__Nm: varchar('__entity__Nm', { length: 100 }),

  ...commonColumns,
});
```
