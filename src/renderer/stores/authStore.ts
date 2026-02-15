import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import type { UserVo } from '@app-types/vo.types';
import { getMe, signin as apiSignin, signout as apiSignout } from '~/api/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserVo | null>(null);
  const isAuthLoaded = ref(false); // 초기 로딩 완료 여부

  const isAuthenticated = computed(() => !!user.value);

  /**
   * @description 앱 시작 시 인증 확인
   */
  const checkAuth = async () => {
    try {
      const res = await getMe();
      if (!res.error && res.data) {
        user.value = res.data;
      }
      else {
        user.value = null;
      }
    }
    catch (e) {
      console.error('Auth check failed:', e);
      user.value = null;
    }
    finally {
      isAuthLoaded.value = true;
    }
  };

  /**
   * @description 로그인
   */
  const signin = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const res = await apiSignin(email, password);
    if (!res.error && res.data) {
      user.value = res.data;
      return { success: true, };
    }
    return { success: false, message: res.message || '로그인 실패', };
  };

  /**
   * @description 로그아웃
   */
  const signout = async () => {
    await apiSignout();
    user.value = null;
  };

  return {
    user,
    isAuthLoaded,
    isAuthenticated,
    checkAuth,
    signin,
    signout,
  };
});
