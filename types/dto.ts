/**
 * 공용 DTO 타입.
 * main(api, server)와 renderer에서 공유합니다.
 */

/** Health API 응답 */
export interface HealthDto {
  status: string;
  timestamp: number;
}

/** Example API 응답 */
export interface ExampleDto {
  exNo: number;
  exName: string;
  exDesc: string | null;
}
