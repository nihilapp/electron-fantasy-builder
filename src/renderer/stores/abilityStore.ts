import type { AbilityVo, ProjectAbilityVo } from '@app-types/vo.types';

export const useAbilityStore = defineStore('ability', () => {
  const abilityList = ref<AbilityVo[]>([]);
  const projectAbilityList = ref<ProjectAbilityVo[]>([]);
  const isLoaded = ref(false);

  /**
   * @description 프로젝트 어빌리티 목록을 조회합니다.
   * @param prjNo 프로젝트 번호
   */
  const getProjectAbilityList = async (prjNo: number) => {
    isLoaded.value = false;

    try {
      const response = await window.electron.api.getProjectAbilityList(prjNo);

      projectAbilityList.value = response.data.list;
      isLoaded.value = true;
    }
    catch (error) {
      console.error('Failed to load project abilities', error);
      projectAbilityList.value = [];
    }
  };

  /**
   * @description 프로젝트 어빌리티를 생성합니다.
   * @param body 생성할 어빌리티 VO
   */
  const createProjectAbility = async (body: ProjectAbilityVo) => {
    const response = await window.electron.api.postProjectAbility(body);

    if (body.prjNo) {
      await getProjectAbilityList(body.prjNo);
    }

    return response.data;
  };

  return {
    abilityList,
    projectAbilityList,
    isLoaded,

    getProjectAbilityList,
    createProjectAbility,
  };
});
