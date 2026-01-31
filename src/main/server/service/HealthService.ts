import type { HealthDto } from '@/types/dto';

import { HealthMapper } from '../db/mapper/HealthMapper';

/**
 * Health 관련 비즈니스 로직.
 * Mapper 결과를 DTO로 가공합니다.
 */
export const HealthService = {
  getHealth(): HealthDto {
    const row = HealthMapper.selectStatus();
    return {
      status: row.status,
      timestamp: row.timestamp,
    };
  },
};
