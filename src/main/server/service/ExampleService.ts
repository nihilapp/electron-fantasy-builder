import type { ExampleDto } from '@app-types/dto';
import type { ListResponseType, ListType } from '@app-types/response.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

/**
 * Example 관련 비즈니스 로직.
 * 향후 ExampleMapper와 연동해 DB에서 조회할 수 있습니다.
 * 목록은 ListResponseType(ResponseType 감싼 형태)로 반환.
 */
const LIST: ExampleDto[] = [
  { exNo: 1, exName: 'Example 1', exDesc: 'Sample description', },
  { exNo: 2, exName: 'Example 2', exDesc: null, },
];

export const ExampleService = {
  getList(page = 1, pageSize = 10): ListResponseType<ExampleDto> {
    const totalCnt = LIST.length;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));
    const start = (page - 1) * pageSize;
    const list = LIST.slice(start, start + pageSize);

    const data: ListType<ExampleDto> = {
      list,
      totalCnt,
      pageSize,
      page,
      totalPage,
      isFirst: page <= 1,
      isLast: page >= totalPage,
    };

    return {
      data,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },
};
