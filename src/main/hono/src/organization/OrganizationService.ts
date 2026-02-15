import type { ListResponseType, ListType, ResponseType } from '@app-types/response.types';
import type { OrganizationVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { OrganizationMapper } from './OrganizationMapper';

export const OrganizationService = {
  async getList(prjNo: number, params: OrganizationVo): Promise<ListResponseType<OrganizationVo>> {
    const { list, totalCnt, } = await OrganizationMapper.selectList(prjNo, params);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPage = Math.max(1, Math.ceil(totalCnt / pageSize));

    const data: ListType<OrganizationVo> = { list, totalCnt, pageSize, page, totalPage, isFirst: page <= 1, isLast: page >= totalPage, };

    return { data, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async getByNo(prjNo: number, orgNo: number): Promise<ResponseType<OrganizationVo | null>> {
    const row = await OrganizationMapper.selectByNo(prjNo, orgNo);

    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.ORGANIZATION_NOT_FOUND, message: '조직을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async create(prjNo: number, vo: OrganizationVo): Promise<ResponseType<OrganizationVo>> {
    const inserted = await OrganizationMapper.insert({ ...vo, prjNo, });

    return { data: inserted, error: false, code: RESPONSE_CODE.CREATED, message: '', };
  },

  async update(prjNo: number, orgNo: number, vo: Partial<OrganizationVo>): Promise<ResponseType<OrganizationVo | null>> {
    const row = await OrganizationMapper.update(prjNo, orgNo, vo);

    if (row === null) return { data: null, error: true, code: RESPONSE_CODE.ORGANIZATION_NOT_FOUND, message: '조직을 찾을 수 없습니다.', };
    return { data: row, error: false, code: RESPONSE_CODE.OK, message: '', };
  },

  async delete(prjNo: number, orgNo: number): Promise<ResponseType<{ deleted: boolean }>> {
    const deleted = await OrganizationMapper.delete(prjNo, orgNo);

    if (!deleted) return { data: { deleted: false, }, error: true, code: RESPONSE_CODE.ORGANIZATION_NOT_FOUND, message: '조직을 찾을 수 없습니다.', };
    return { data: { deleted: true, }, error: false, code: RESPONSE_CODE.OK, message: '', };
  },
};
