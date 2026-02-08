import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { RegionVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { RegionMapper } from '../db/mapper/RegionMapper';

export const RegionService = {
  async getList(prjNo: number, params: RegionVo): Promise<ListResponseType<RegionVo>> {
    const { list, totalCnt, } = await RegionMapper.selectList(prjNo, params);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<RegionVo> = { list, totalCnt, pageSize, page, totalPage, isFirst: page <= 1, isLast: page >= totalPage, };

    return { data, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async getByNo(prjNo: number, regionNo: number): Promise<ResponseType<RegionVo | null>> {
    const row = await RegionMapper.selectByNo(prjNo, regionNo);

    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.REGION_NOT_FOUND, message: '지역을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async create(prjNo: number, vo: RegionVo): Promise<ResponseType<RegionVo>> {
    const inserted = await RegionMapper.insert({ ...vo, prjNo, });

    return { data: inserted, error: false, code: RESPONSE_CODE.CREATED, message: '', };
  },

  async update(prjNo: number, regionNo: number, vo: Partial<RegionVo>): Promise<ResponseType<RegionVo | null>> {
    const row = await RegionMapper.update(prjNo, regionNo, vo);

    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.REGION_NOT_FOUND, message: '지역을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async delete(prjNo: number, regionNo: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await RegionMapper.delete(prjNo, regionNo);

    if (!deleted) return { data: { deleted: false, }, error: true, code: RESPONSE_CODE.REGION_NOT_FOUND, message: '지역을 찾을 수 없습니다.', };
    return { data: { deleted: true, }, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
};
