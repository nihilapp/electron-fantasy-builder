// 모든 API 함수를 import하고 export하는 통합 역할
export { apiGetExample, ipcGetExample } from './apiGetExample';
export { apiGetHealth, ipcGetHealth } from './apiGetHealth';
export type { ExampleDto, HealthDto } from '@/types/dto';
// 새로운 API 함수를 추가할 때마다 여기에 export 추가
