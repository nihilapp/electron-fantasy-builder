import type { ProjectAbilityVo } from '@app-types/vo.types';

export const useProjectAbilityStore = defineStore('projectAbility', () => {
  /** @description 프로젝트 어빌리티 목록 */
  const projectAbilityList = ref<ProjectAbilityVo[]>([]);
  /** @description 로드 상태 */
  const isLoaded = ref(false);

  /**
   * @description 프로젝트 어빌리티 목록을 조회합니다.
   * @param prjNo - 프로젝트 번호
   * @param params - 목록 조회 파라미터 (선택)
   */
  const getProjectAbilityList = async (
    prjNo: number,
    params?: { page?: number; pageSize?: number }
  ) => {
    isLoaded.value = false;

    try {
      const response = await window.electron.api.getProjectAbilityList(prjNo, params);

      projectAbilityList.value = response.data?.list ?? [];
      isLoaded.value = true;
    }
    catch (error) {
      console.error('Failed to load project abilities', error);
      projectAbilityList.value = [];
    }
  };

  /**
   * @description 프로젝트 어빌리티를 생성합니다.
   * @param body - 생성할 어빌리티 VO
   */
  const createProjectAbility = async (body: ProjectAbilityVo) => {
    const response = await window.electron.api.postProjectAbility(body);

    if (body.prjNo != null) {
      await getProjectAbilityList(body.prjNo);
    }

    return response.data;
  };

  return {
    projectAbilityList,
    isLoaded,
    getProjectAbilityList,
    createProjectAbility,
  };
});
