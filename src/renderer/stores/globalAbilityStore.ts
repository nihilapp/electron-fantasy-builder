import type { AbilityVo } from '@app-types/vo.types';

export const useGlobalAbilityStore = defineStore('globalAbility', () => {
  /** @description 글로벌 어빌리티 목록 */
  const abilityList = ref<AbilityVo[]>([]);
  /** @description 로드 상태 */
  const isLoaded = ref(false);

  /**
   * @description 글로벌 어빌리티 목록을 조회합니다.
   * @param params - 목록 조회 파라미터 (선택)
   */
  const getAbilityList = async (params?: { page?: number; pageSize?: number }) => {
    isLoaded.value = false;

    try {
      const response = await window.electron.api.getAbilityList(params);

      abilityList.value = response.data?.list ?? [];
      isLoaded.value = true;
    }
    catch (error) {
      console.error('Failed to load global abilities', error);
      abilityList.value = [];
    }
  };

  /**
   * @description 글로벌 어빌리티를 생성합니다.
   * @param body - 생성할 어빌리티 VO
   */
  const createAbility = async (body: AbilityVo) => {
    const response = await window.electron.api.postAbility(body);

    await getAbilityList();

    return response.data;
  };

  return {
    abilityList,
    isLoaded,
    getAbilityList,
    createAbility,
  };
});
