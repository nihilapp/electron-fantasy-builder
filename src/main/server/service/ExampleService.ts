import type { ExampleDto } from '@/types/dto';

/**
 * Example 관련 비즈니스 로직.
 * 향후 ExampleMapper와 연동해 DB에서 조회할 수 있습니다.
 */
export const ExampleService = {
  getList(): ExampleDto[] {
    return [
      { exNo: 1, exName: 'Example 1', exDesc: 'Sample description', },
      { exNo: 2, exName: 'Example 2', exDesc: null, },
    ];
  },
};
