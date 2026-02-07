import type { ProjectTraitVo, TraitVo } from '@app-types/vo.types';

export const useTraitStore = defineStore('trait', () => {
  const traitList = ref<TraitVo[]>([]);
  const projectTraitList = ref<ProjectTraitVo[]>([]);
  const isLoaded = ref(false);

  /**
   * @description 프로젝트 특성 목록을 조회합니다.
   * @param prjNo 프로젝트 번호
   */
  const getProjectTraitList = async (prjNo: number) => {
    isLoaded.value = false;

    try {
      const response = await window.electron.api.getProjectTraitList(prjNo);

      projectTraitList.value = response.data.list;
      // TODO: 글로벌 특성도 함께 로드해야 한다면 추가 구현
      isLoaded.value = true;
    }
    catch (error) {
      console.error('Failed to load project traits', error);
      projectTraitList.value = [];
    }
  };

  /**
   * @description 프로젝트 특성을 생성합니다.
   * @param body 생성할 특성 VO
   */
  const createProjectTrait = async (body: ProjectTraitVo) => {
    const response = await window.electron.api.postProjectTrait(body);

    if (body.prjNo) {
      await getProjectTraitList(body.prjNo);
    }

    return response.data;
  };

  return {
    traitList,
    projectTraitList,
    isLoaded,

    getProjectTraitList,
    createProjectTrait,
  };
});
