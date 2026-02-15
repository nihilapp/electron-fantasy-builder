import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { ItemVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { ItemMapper } from './ItemMapper';

export const ItemService = {
  async getList(prjNo: number, params: ItemVo): Promise<ListResponseType<ItemVo>> {
    const { list, totalCnt, } = await ItemMapper.selectList(prjNo, params);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<ItemVo> = { list, totalCnt, pageSize, page, totalPage, isFirst: page <= 1, isLast: page >= totalPage, };

    return { data, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async getByNo(prjNo: number, itemNo: number): Promise<ResponseType<ItemVo | null>> {
    const row = await ItemMapper.selectByNo(prjNo, itemNo);

    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.ITEM_NOT_FOUND, message: '아이템을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async create(prjNo: number, vo: ItemVo): Promise<ResponseType<ItemVo>> {
    const inserted = await ItemMapper.insert({ ...vo, prjNo, });

    return { data: inserted, error: false, code: RESPONSE_CODE.CREATED, message: '', };
  },

  async update(prjNo: number, itemNo: number, vo: Partial<ItemVo>): Promise<ResponseType<ItemVo | null>> {
    const row = await ItemMapper.update(prjNo, itemNo, vo);

    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.ITEM_NOT_FOUND, message: '아이템을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async delete(prjNo: number, itemNo: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await ItemMapper.delete(prjNo, itemNo);

    if (!deleted) return { data: { deleted: false, }, error: true, code: RESPONSE_CODE.ITEM_NOT_FOUND, message: '아이템을 찾을 수 없습니다.', };
    return { data: { deleted: true, }, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
};
