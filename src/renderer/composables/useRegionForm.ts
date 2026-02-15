import type { QueryClient } from '@tanstack/vue-query';
import type { Ref } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

import type { RegionVo } from '@app-types/vo.types';

export interface RegionFormState {
  regionNm: string;
  regionType: string;
  explorStat: string;
  regionExpln: string;
  locDesc: string;
  climateEnv: string;
  terrainFeat: string;
  envSpec: string;
  funcFeat: string;
  dangerLvl: string;
  dangerFctr: string;
  inhabitInfo: string;
  unknownEntity: string;
  mainFclty: string;
  rsrcList: string;
  upRegionNo: string;
  ntnNo: string;
  loreType: string;
  subLoreType: string;
}

export interface UseRegionFormArgs {
  prjNo: Ref<number | null>;
  route: RouteLocationNormalizedLoaded;
  router: Router;
  isCreateMode: Ref<boolean>;
  regionNoNum: Ref<number | null>;
  queryClient: QueryClient;
}

const defaultFormState: RegionFormState = {
  regionNm: '',
  regionType: '',
  explorStat: '',
  regionExpln: '',
  locDesc: '',
  climateEnv: '',
  terrainFeat: '',
  envSpec: '',
  funcFeat: '',
  dangerLvl: '',
  dangerFctr: '',
  inhabitInfo: '',
  unknownEntity: '',
  mainFclty: '',
  rsrcList: '',
  upRegionNo: '',
  ntnNo: '',
  loreType: '',
  subLoreType: '',
};

/**
 * @description 지역 등록/상세 폼 상태·로직. RegionFormSection에서 사용.
 * @param args - prjNo, route, router, isCreateMode, regionNoNum, queryClient
 */
export function useRegionForm(args: UseRegionFormArgs) {
  const { prjNo, route, router, isCreateMode, regionNoNum, queryClient, } = args;

  const item = ref<RegionVo | null>(null);
  const loadError = ref<string | null>(null);
  const isViewMode = ref(true);
  const form = ref<RegionFormState>({ ...defaultFormState, });
  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);

  const canSubmit = computed(() => form.value.regionNm.trim() !== '');

  async function loadItem() {
    if (isCreateMode.value) return;

    const no = prjNo.value ?? (route.params.prjNo != null
      ? Number(route.params.prjNo)
      : null);
    const regionNo = regionNoNum.value;

    if (no == null || !Number.isInteger(no) || regionNo == null) {
      item.value = null;
      loadError.value = '프로젝트 또는 지역 번호가 올바르지 않습니다.';
      return;
    }

    loadError.value = null;

    try {
      const response = await window.electron.api.getRegion(no, regionNo);

      if (response.error === true) {
        item.value = null;
        loadError.value = response.message ?? '지역을 찾을 수 없습니다.';
        return;
      }

      const data = response.data ?? null;
      item.value = data;

      if (data) {
        form.value = {
          regionNm: data.regionNm ?? '',
          regionType: data.regionType ?? '',
          explorStat: data.explorStat ?? '',
          regionExpln: data.regionExpln ?? '',
          locDesc: data.locDesc ?? '',
          climateEnv: data.climateEnv ?? '',
          terrainFeat: data.terrainFeat ?? '',
          envSpec: data.envSpec ?? '',
          funcFeat: data.funcFeat ?? '',
          dangerLvl: data.dangerLvl ?? '',
          dangerFctr: data.dangerFctr ?? '',
          inhabitInfo: data.inhabitInfo ?? '',
          unknownEntity: data.unknownEntity ?? '',
          mainFclty: data.mainFclty ?? '',
          rsrcList: data.rsrcList ?? '',
          upRegionNo: data.upRegionNo != null
            ? String(data.upRegionNo)
            : '',
          ntnNo: data.ntnNo != null
            ? String(data.ntnNo)
            : '',
          loreType: data.loreType ?? '',
          subLoreType: data.subLoreType ?? '',
        };
        if (route.query.mode === 'edit') {
          isViewMode.value = false;
        }
      }
    }
    catch (err) {
      item.value = null;
      loadError.value = err instanceof Error
        ? err.message
        : '지역을 불러오지 못했습니다.';
    }
  }

  function enterEditMode() {
    if (item.value) {
      form.value = {
        regionNm: item.value.regionNm ?? '',
        regionType: item.value.regionType ?? '',
        explorStat: item.value.explorStat ?? '',
        regionExpln: item.value.regionExpln ?? '',
        locDesc: item.value.locDesc ?? '',
        climateEnv: item.value.climateEnv ?? '',
        terrainFeat: item.value.terrainFeat ?? '',
        envSpec: item.value.envSpec ?? '',
        funcFeat: item.value.funcFeat ?? '',
        dangerLvl: item.value.dangerLvl ?? '',
        dangerFctr: item.value.dangerFctr ?? '',
        inhabitInfo: item.value.inhabitInfo ?? '',
        unknownEntity: item.value.unknownEntity ?? '',
        mainFclty: item.value.mainFclty ?? '',
        rsrcList: item.value.rsrcList ?? '',
        upRegionNo: item.value.upRegionNo != null
          ? String(item.value.upRegionNo)
          : '',
        ntnNo: item.value.ntnNo != null
          ? String(item.value.ntnNo)
          : '',
        loreType: item.value.loreType ?? '',
        subLoreType: item.value.subLoreType ?? '',
      };
      errorMessage.value = null;
      isViewMode.value = false;
    }
  }

  function exitEditMode() {
    isViewMode.value = true;
    errorMessage.value = null;
  }

  function buildBody(): Partial<RegionVo> {
    const parseNum = (val: string) => {
      const n = Number(val);
      return Number.isNaN(n) || val.trim() === ''
        ? null
        : n;
    };

    return {
      regionNm: form.value.regionNm.trim(),
      regionType: form.value.regionType.trim() || null,
      explorStat: form.value.explorStat.trim() || null,
      regionExpln: form.value.regionExpln.trim() || null,
      locDesc: form.value.locDesc.trim() || null,
      climateEnv: form.value.climateEnv.trim() || null,
      terrainFeat: form.value.terrainFeat.trim() || null,
      envSpec: form.value.envSpec.trim() || null,
      funcFeat: form.value.funcFeat.trim() || null,
      dangerLvl: form.value.dangerLvl.trim() || null,
      dangerFctr: form.value.dangerFctr.trim() || null,
      inhabitInfo: form.value.inhabitInfo.trim() || null,
      unknownEntity: form.value.unknownEntity.trim() || null,
      mainFclty: form.value.mainFclty.trim() || null,
      rsrcList: form.value.rsrcList.trim() || null,
      upRegionNo: parseNum(form.value.upRegionNo),
      ntnNo: parseNum(form.value.ntnNo),
      loreType: form.value.loreType.trim() || null,
      subLoreType: form.value.subLoreType.trim() || null,
    };
  }

  async function submit() {
    const no = prjNo.value;
    if (no == null || !canSubmit.value || isSubmitting.value) return;

    errorMessage.value = null;
    isSubmitting.value = true;

    try {
      const body = buildBody();

      if (isCreateMode.value) {
        await window.electron.api.postRegion(no, body);
        queryClient.invalidateQueries({ queryKey: [ 'regions', no, ], });
        router.push({ name: 'project-regions', params: { prjNo: String(no), }, });
      }
      else {
        const regionNo = regionNoNum.value;
        if (regionNo == null) return;
        await window.electron.api.patchRegion(no, regionNo, body);
        queryClient.invalidateQueries({ queryKey: [ 'regions', no, ], });
        queryClient.invalidateQueries({ queryKey: [ 'region', no, regionNo, ], });
        await loadItem();
        isViewMode.value = true;
      }
    }
    catch (err) {
      errorMessage.value = err instanceof Error
        ? err.message
        : (isCreateMode.value
          ? '등록에 실패했습니다.'
          : '저장에 실패했습니다.');
    }
    finally {
      isSubmitting.value = false;
    }
  }

  function goToList() {
    const no = prjNo.value;
    if (no == null) return;
    router.push({ name: 'project-regions', params: { prjNo: String(no), }, });
  }

  return {
    item,
    loadError,
    isViewMode,
    form,
    isSubmitting,
    errorMessage,
    canSubmit,
    loadItem,
    enterEditMode,
    exitEditMode,
    buildBody,
    submit,
    goToList,
  };
}
