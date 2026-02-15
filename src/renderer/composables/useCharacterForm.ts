import type { QueryClient } from '@tanstack/vue-query';
import type { Ref } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

import type { CharacterVo } from '@app-types/vo.types';

export interface CharacterFormState {
  charNm: string;
  aliasNm: string;
  roleType: string;
  logline: string;
  narrFunc: string;
  raceNo: string;
  ntnNo: string;
  orgNo: string;
  orgRank: string;
  loreType: string;
  subLoreType: string;
}

export interface UseCharacterFormArgs {
  prjNo: Ref<number | null>;
  route: RouteLocationNormalizedLoaded;
  router: Router;
  isCreateMode: Ref<boolean>;
  charNoNum: Ref<number | null>;
  queryClient: QueryClient;
}

const defaultFormState: CharacterFormState = {
  charNm: '',
  aliasNm: '',
  roleType: '',
  logline: '',
  narrFunc: '',
  raceNo: '',
  ntnNo: '',
  orgNo: '',
  orgRank: '',
  loreType: '',
  subLoreType: '',
};

/**
 * @description 인물 등록/상세 폼 상태·로직. CharacterFormSection에서 사용.
 * @param args - prjNo, route, router, isCreateMode, charNoNum, queryClient
 */
export function useCharacterForm(args: UseCharacterFormArgs) {
  const { prjNo, route, router, isCreateMode, charNoNum, queryClient, } = args;

  const item = ref<CharacterVo | null>(null);
  const loadError = ref<string | null>(null);
  const isViewMode = ref(true);
  const form = ref<CharacterFormState>({ ...defaultFormState, });
  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);

  const canSubmit = computed(() => form.value.charNm.trim() !== '');

  async function loadItem() {
    if (isCreateMode.value) return;

    const no = prjNo.value ?? (route.params.prjNo != null
      ? Number(route.params.prjNo)
      : null);
    const charNo = charNoNum.value;

    if (no == null || !Number.isInteger(no) || charNo == null) {
      item.value = null;
      loadError.value = '프로젝트 또는 인물 번호가 올바르지 않습니다.';
      return;
    }

    loadError.value = null;

    try {
      const response = await window.electron.api.getCharacter(no, charNo);

      if (response.error === true) {
        item.value = null;
        loadError.value = response.message ?? '인물을 찾을 수 없습니다.';
        return;
      }

      const data = response.data ?? null;
      item.value = data;

      if (data) {
        form.value = {
          charNm: data.charNm ?? '',
          aliasNm: data.aliasNm ?? '',
          roleType: data.roleType ?? '',
          logline: data.logline ?? '',
          narrFunc: data.narrFunc ?? '',
          raceNo: data.raceNo != null
            ? String(data.raceNo)
            : '',
          ntnNo: data.ntnNo != null
            ? String(data.ntnNo)
            : '',
          orgNo: data.orgNo != null
            ? String(data.orgNo)
            : '',
          orgRank: data.orgRank ?? '',
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
        : '인물을 불러오지 못했습니다.';
    }
  }

  function enterEditMode() {
    if (item.value) {
      form.value = {
        charNm: item.value.charNm ?? '',
        aliasNm: item.value.aliasNm ?? '',
        roleType: item.value.roleType ?? '',
        logline: item.value.logline ?? '',
        narrFunc: item.value.narrFunc ?? '',
        raceNo: item.value.raceNo != null
          ? String(item.value.raceNo)
          : '',
        ntnNo: item.value.ntnNo != null
          ? String(item.value.ntnNo)
          : '',
        orgNo: item.value.orgNo != null
          ? String(item.value.orgNo)
          : '',
        orgRank: item.value.orgRank ?? '',
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

  function buildBody(): Partial<CharacterVo> {
    const parseNum = (val: string) => {
      const n = Number(val);
      return Number.isNaN(n) || val.trim() === ''
        ? null
        : n;
    };

    return {
      charNm: form.value.charNm.trim(),
      aliasNm: form.value.aliasNm.trim() || null,
      roleType: form.value.roleType.trim() || null,
      logline: form.value.logline.trim() || null,
      narrFunc: form.value.narrFunc.trim() || null,
      raceNo: parseNum(form.value.raceNo),
      ntnNo: parseNum(form.value.ntnNo),
      orgNo: parseNum(form.value.orgNo),
      orgRank: form.value.orgRank.trim() || null,
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
        await window.electron.api.postCharacter(no, body);
        queryClient.invalidateQueries({ queryKey: [ 'characters', no, ], });
        router.push({ name: 'project-characters', params: { prjNo: String(no), }, });
      }
      else {
        const charNo = charNoNum.value;
        if (charNo == null) return;
        await window.electron.api.patchCharacter(no, charNo, body);
        queryClient.invalidateQueries({ queryKey: [ 'characters', no, ], });
        queryClient.invalidateQueries({ queryKey: [ 'character', no, charNo, ], });
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
    router.push({ name: 'project-characters', params: { prjNo: String(no), }, });
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
