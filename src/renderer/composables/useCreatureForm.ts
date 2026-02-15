import type { QueryClient } from '@tanstack/vue-query';
import type { Ref } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

import type { CreatureVo } from '@app-types/vo.types';

export interface CreatureFormState {
  creatureNm: string;
  creatureType: string;
  dangerGrd: string;
  identStat: string;
  creatureExpln: string;
  loreType: string;
  subLoreType: string;
}

export interface UseCreatureFormArgs {
  prjNo: Ref<number | null>;
  route: RouteLocationNormalizedLoaded;
  router: Router;
  isCreateMode: Ref<boolean>;
  creatureNoNum: Ref<number | null>;
  queryClient: QueryClient;
}

const defaultFormState: CreatureFormState = {
  creatureNm: '',
  creatureType: '',
  dangerGrd: '',
  identStat: '',
  creatureExpln: '',
  loreType: '',
  subLoreType: '',
};

/**
 * @description 종족/생물 등록/상세 폼 상태·로직. CreatureFormSection에서 사용.
 */
export function useCreatureForm(args: UseCreatureFormArgs) {
  const { prjNo, route, router, isCreateMode, creatureNoNum, queryClient, } = args;

  const item = ref<CreatureVo | null>(null);
  const loadError = ref<string | null>(null);
  const isViewMode = ref(true);
  const form = ref<CreatureFormState>({ ...defaultFormState, });
  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);

  const canSubmit = computed(() => form.value.creatureNm.trim() !== '');

  async function loadItem() {
    if (isCreateMode.value) return;

    const no = prjNo.value ?? (route.params.prjNo != null
      ? Number(route.params.prjNo)
      : null);
    const creatureNo = creatureNoNum.value;

    if (no == null || !Number.isInteger(no) || creatureNo == null) {
      item.value = null;
      loadError.value = '프로젝트 또는 종족/생물 번호가 올바르지 않습니다.';
      return;
    }

    loadError.value = null;

    try {
      const response = await window.electron.api.getCreature(no, creatureNo);

      if (response.error === true) {
        item.value = null;
        loadError.value = response.message ?? '종족/생물을 찾을 수 없습니다.';
        return;
      }

      const data = response.data ?? null;
      item.value = data;

      if (data) {
        form.value = {
          creatureNm: data.creatureNm ?? '',
          creatureType: data.creatureType ?? '',
          dangerGrd: data.dangerGrd ?? '',
          identStat: data.identStat ?? '',
          creatureExpln: data.creatureExpln ?? '',
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
        : '종족/생물을 불러오지 못했습니다.';
    }
  }

  function enterEditMode() {
    if (item.value) {
      form.value = {
        creatureNm: item.value.creatureNm ?? '',
        creatureType: item.value.creatureType ?? '',
        dangerGrd: item.value.dangerGrd ?? '',
        identStat: item.value.identStat ?? '',
        creatureExpln: item.value.creatureExpln ?? '',
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

  function buildBody(): Partial<CreatureVo> {
    return {
      creatureNm: form.value.creatureNm.trim(),
      creatureType: form.value.creatureType.trim() || null,
      dangerGrd: form.value.dangerGrd.trim() || null,
      identStat: form.value.identStat.trim() || null,
      creatureExpln: form.value.creatureExpln.trim() || null,
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
        await window.electron.api.postCreature(no, body);
        queryClient.invalidateQueries({ queryKey: [ 'creatures', no, ], });
        router.push({ name: 'project-creatures', params: { prjNo: String(no), }, });
      }
      else {
        const creatureNo = creatureNoNum.value;
        if (creatureNo == null) return;
        await window.electron.api.patchCreature(no, creatureNo, body);
        queryClient.invalidateQueries({ queryKey: [ 'creatures', no, ], });
        queryClient.invalidateQueries({ queryKey: [ 'creature', no, creatureNo, ], });
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
    router.push({ name: 'project-creatures', params: { prjNo: String(no), }, });
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
