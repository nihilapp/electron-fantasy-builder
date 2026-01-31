/**
 * Health 관련 데이터 접근 (Mapper).
 * DB 테이블이 없어도 서버 상태·시간 등 시스템 정보를 반환하는 계층입니다.
 */

export interface HealthRow {
  timestamp: number;
  status: string;
}

export const HealthMapper = {
  /** 서버 상태·타임스탬프 조회 (현재는 시스템 정보, 향후 DB에서 읽을 수 있음) */
  selectStatus(): HealthRow {
    return {
      timestamp: Date.now(),
      status: 'healthy',
    };
  },
};
