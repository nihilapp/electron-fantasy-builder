
```typescript
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumns } from './common.columns';

/**
 * __Entity__ Table (Local SQLite)
 */
export const __entity__sTable = sqliteTable('__entity__s', {
  __entity__No: integer('__entity__No').primaryKey({ autoIncrement: true }),
  
  // Define columns here
  // __entity__Nm: text('__entity__Nm'),

  ...commonColumns,
});
```
