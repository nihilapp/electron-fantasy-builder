
```typescript
import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { __Entity__Vo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { __Entity__Mapper } from './__Entity__Mapper';

/**
 * __Entity__ Business Logic.
 */
export const __Entity__Service = {
  async getList(params: __Entity__Vo): Promise<ListResponseType<__Entity__Vo>> {
    const { list, totalCnt, } = await __Entity__Mapper.selectList(params);
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<__Entity__Vo> = {
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

  async getByNo(__entity__No: number): Promise<ResponseType<__Entity__Vo | null>> {
    const row = await __Entity__Mapper.selectByNo(__entity__No);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.NOT_FOUND,
        message: '__Entity__ not found',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async create(vo: __Entity__Vo): Promise<ResponseType<__Entity__Vo>> {
    const inserted = await __Entity__Mapper.insert(vo);

    return {
      data: inserted,
      error: false,
      code: RESPONSE_CODE.CREATED,
      message: '',
    };
  },

  async update(__entity__No: number, vo: Partial<__Entity__Vo>): Promise<ResponseType<__Entity__Vo | null>> {
    const row = await __Entity__Mapper.update(__entity__No, vo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.NOT_FOUND,
        message: '__Entity__ not found',
      };
    }

    return {
      data: row,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  async delete(__entity__No: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await __Entity__Mapper.delete(__entity__No);

    if (!deleted) {
      return {
        data: { deleted: false, },
        error: true,
        code: RESPONSE_CODE.NOT_FOUND,
        message: '__Entity__ not found',
      };
    }

    return {
      data: { deleted: true, },
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },
};
```
