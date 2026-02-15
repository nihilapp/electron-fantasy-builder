import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { NationVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { NationMapper } from './NationMapper';

export const NationService = {
  async getList(prjNo: number, params: NationVo): Promise<ListResponseType<NationVo>> {
    const { list, totalCnt, } = await NationMapper.selectList(prjNo, params);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<NationVo> = { list, totalCnt, pageSize, page, totalPage, isFirst: page <= 1, isLast: page >= totalPage, };

    return { data, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async getByNo(prjNo: number, ntnNo: number): Promise<ResponseType<NationVo | null>> {
    const row = await NationMapper.selectByNo(prjNo, ntnNo);

    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.NATION_NOT_FOUND, message: '국가를 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async create(prjNo: number, vo: NationVo): Promise<ResponseType<NationVo>> {
    const inserted = await NationMapper.insert({ ...vo, prjNo, });

    return { data: inserted, error: false, code: RESPONSE_CODE.CREATED, message: '', };
  },

  async update(prjNo: number, ntnNo: number, vo: Partial<NationVo>): Promise<ResponseType<NationVo | null>> {
    const row = await NationMapper.update(prjNo, ntnNo, vo);

    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.NATION_NOT_FOUND, message: '국가를 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async delete(prjNo: number, ntnNo: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await NationMapper.delete(prjNo, ntnNo);

    if (!deleted) return { data: { deleted: false, }, error: true, code: RESPONSE_CODE.NATION_NOT_FOUND, message: '국가를 찾을 수 없습니다.', };
    return { data: { deleted: true, }, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
};
