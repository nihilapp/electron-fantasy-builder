import type { ResponseType } from '@app-types/response.types';
import type { UserVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { UserMapper } from './UserMapper';

/**
 * 사용자 비즈니스 로직.
 */
export const UserService = {
  /**
   * @description 사용자 번호로 조회.
   */
  async getByNo(userNo: number): Promise<ResponseType<UserVo | null>> {
    const row = await UserMapper.selectByNo(userNo);

    if (row === null) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.NOT_FOUND, // 404
        message: '사용자를 찾을 수 없습니다.',
      };
    }

    // 비밀번호 등 민감 정보 제거 (VO에서 optional 처리되어 있으나 확실히 제거)
    const { enpswd: _, ...safeUser } = row;

    return {
      data: safeUser as UserVo,
      error: false,
      code: RESPONSE_CODE.OK,
      message: '',
    };
  },

  /**
   * @description 이메일로 조회 (AuthService 내부용, Controller 노출 여부는 선택).
   */
  async getByEmail(email: string): Promise<UserVo | null> {
    return await UserMapper.selectByEmail(email);
  },

  /**
   * @description 사용자 생성 (회원가입/테스트용).
   */
  async create(vo: UserVo): Promise<ResponseType<UserVo | null>> {
    // 이메일 중복 체크 등은 필요 시 추가
    const existing = await UserMapper.selectByEmail(vo.userEml!);
    if (existing) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: '이미 존재하는 이메일입니다.',
      };
    }

    const inserted = await UserMapper.insert(vo);
    const { enpswd: _, ...safeUser } = inserted;

    return {
      data: safeUser as UserVo,
      error: false,
      code: RESPONSE_CODE.CREATED,
      message: '',
    };
  },
};
