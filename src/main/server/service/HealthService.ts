import type { HealthDto } from '@app-types/dto.types';

import { getSqliteVersion } from '../db/context';
import { HealthMapper } from '../db/mapper/HealthMapper';

/**
 * Health 관련 비즈니스 로직.
 * Mapper 결과를 DTO로 가공합니다. 로컬 모드일 때 SQLite 버전 포함.
 */
export const HealthService = {
  getHealth(): HealthDto {
    const row = HealthMapper.selectStatus();
    const sqliteVersion = getSqliteVersion();

    return {
      status: row.status,
      timestamp: row.timestamp,
      ...(sqliteVersion !== null
        ? { sqliteVersion, }
        : {}),
    };
  },
};
