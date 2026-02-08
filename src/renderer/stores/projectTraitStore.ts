import type { ProjectTraitVo } from '@app-types/vo.types';

export const useProjectTraitStore = defineStore('projectTrait', () => {
  /** @description 프로젝트 특성 목록 */
  const projectTraitList = ref<ProjectTraitVo[]>([]);
  /** @description 로드 상태 */
  const isLoaded = ref(false);

  /**
   * @description 프로젝트 특성 목록을 조회합니다.
   * @param prjNo - 프로젝트 번호
   * @param params - 목록 조회 파라미터 (선택)
   */
  const getProjectTraitList = async (
    prjNo: number,
    params?: { page?: number; pageSize?: number }
  ) => {
    isLoaded.value = false;

    try {
      const response = await window.electron.api.getProjectTraitList(prjNo, params);

      projectTraitList.value = response.data?.list ?? [];
      isLoaded.value = true;
    }
    catch (error) {
      console.error('Failed to load project traits', error);
      projectTraitList.value = [];
    }
  };

  /**
   * @description 프로젝트 특성을 생성합니다.
   * @param body - 생성할 특성 VO
   */
  const createProjectTrait = async (body: ProjectTraitVo) => {
    const response = await window.electron.api.postProjectTrait(body);

    if (body.prjNo != null) {
      await getProjectTraitList(body.prjNo);
    }

    return response.data;
  };

  return {
    projectTraitList,
    isLoaded,
    getProjectTraitList,
    createProjectTrait,
  };
});
