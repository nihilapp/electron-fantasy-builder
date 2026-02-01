import type { ProjectVo } from '@app-types/vo.types';

export const useProjectStore = defineStore('project', () => {
  const projectList = ref<ProjectVo[]>([]);
  /** 초기 목록 로드 완료 여부. MainView/사이드바 등에서 "있음/없음" 판단 전에 사용 */
  const isLoaded = ref(false);

  const hasProjects = computed(() => projectList.value.length > 0);

  /** 프로젝트 목록 조회. 목록·isLoaded 갱신 */
  const getProjectList = async () => {
    const response = await window.electron.api.getProjectList();
    projectList.value = response.data.list;
    isLoaded.value = true;
  };

  /** 프로젝트 상세 조회. 목록은 갱신하지 않음 */
  const getProjectByNo = async (prjNo: number) => {
    const response = await window.electron.api.getProjectByNo(prjNo);
    return response.data;
  };

  /** 프로젝트 생성. 생성 후 목록 갱신 */
  const createProject = async (body: ProjectVo) => {
    const response = await window.electron.api.postProject(body);
    await getProjectList();
    return response.data;
  };

  /** 프로젝트 수정. 수정 후 목록 갱신 */
  const updateProject = async (prjNo: number, body: Partial<ProjectVo>) => {
    const response = await window.electron.api.patchProject(prjNo, body);
    await getProjectList();
    return response.data;
  };

  /** 프로젝트 삭제. 삭제 후 목록 갱신 */
  const deleteProject = async (prjNo: number) => {
    const response = await window.electron.api.deleteProject(prjNo);
    await getProjectList();
    return response.data;
  };

  return {
    // state
    projectList,
    isLoaded,

    // getters
    hasProjects,

    // actions
    getProjectList,
    getProjectByNo,
    createProject,
    updateProject,
    deleteProject,
  };
});
