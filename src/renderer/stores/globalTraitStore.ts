import type { TraitVo } from '@app-types/vo.types';

export const useGlobalTraitStore = defineStore('globalTrait', () => {
  /** @description 글로벌 특성 목록 */
  const traitList = ref<TraitVo[]>([]);
  /** @description 로드 상태 */
  const isLoaded = ref(false);

  /**
   * @description 글로벌 특성 목록을 조회합니다.
   * @param params - 목록 조회 파라미터 (선택)
   */
  const getTraitList = async (params?: { page?: number; pageSize?: number }) => {
    isLoaded.value = false;

    try {
      const response = await window.electron.api.getTraitList(params);

      traitList.value = response.data?.list ?? [];
      isLoaded.value = true;
    }
    catch (error) {
      console.error('Failed to load global traits', error);
      traitList.value = [];
    }
  };

  /**
   * @description 글로벌 특성을 생성합니다.
   * @param body - 생성할 특성 VO
   */
  const createTrait = async (body: TraitVo) => {
    const response = await window.electron.api.postTrait(body);

    await getTraitList();

    return response.data;
  };

  return {
    traitList,
    isLoaded,
    getTraitList,
    createTrait,
  };
});
