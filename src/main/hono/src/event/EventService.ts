import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { EventVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { EventMapper } from './EventMapper';

export const EventService = {
  async getList(prjNo: number, params: EventVo): Promise<ListResponseType<EventVo>> {
    const { list, totalCnt, } = await EventMapper.selectList(prjNo, params);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<EventVo> = { list, totalCnt, pageSize, page, totalPage, isFirst: page <= 1, isLast: page >= totalPage, };

    return { data, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async getByNo(prjNo: number, eventNo: number): Promise<ResponseType<EventVo | null>> {
    const row = await EventMapper.selectByNo(prjNo, eventNo);

    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.EVENT_NOT_FOUND, message: '사건을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async create(prjNo: number, vo: EventVo): Promise<ResponseType<EventVo>> {
    const inserted = await EventMapper.insert({ ...vo, prjNo, });

    return { data: inserted, error: false, code: RESPONSE_CODE.CREATED, message: '', };
  },

  async update(prjNo: number, eventNo: number, vo: Partial<EventVo>): Promise<ResponseType<EventVo | null>> {
    const row = await EventMapper.update(prjNo, eventNo, vo);

    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.EVENT_NOT_FOUND, message: '사건을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async delete(prjNo: number, eventNo: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await EventMapper.delete(prjNo, eventNo);

    if (!deleted) return { data: { deleted: false, }, error: true, code: RESPONSE_CODE.EVENT_NOT_FOUND, message: '사건을 찾을 수 없습니다.', };
    return { data: { deleted: true, }, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
};
