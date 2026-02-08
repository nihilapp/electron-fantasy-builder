import type { QueryClient } from '@tanstack/vue-query';
import type { Ref } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

import type { CoreRuleVo } from '@app-types/vo.types';

export interface CoreRuleFormState {
  coreNm: string;
  aplyScope: string;
  defDesc: string;
  strcElem: string;
  mechDesc: string;
  narrAply: string;
  linkDocs: string;
  rmk: string;
  tags: string;
}

export interface UseCoreRuleFormArgs {
  prjNo: Ref<number | null>;
  route: RouteLocationNormalizedLoaded;
  router: Router;
  isCreateMode: Ref<boolean>;
  coreNoNum: Ref<number | null>;
  queryClient: QueryClient;
}

const defaultFormState: CoreRuleFormState = {
  coreNm: '',
  aplyScope: '',
  defDesc: '',
  strcElem: '',
  mechDesc: '',
  narrAply: '',
  linkDocs: '',
  rmk: '',
  tags: '',
};

/**
 * @description 주요 설정 등록/상세 폼 상태·로직. CoreRuleFormSection에서 사용.
 */
export function useCoreRuleForm(args: UseCoreRuleFormArgs) {
  const { prjNo, route, router, isCreateMode, coreNoNum, queryClient, } = args;

  const item = ref<CoreRuleVo | null>(null);
  const loadError = ref<string | null>(null);
  const isViewMode = ref(true);
  const form = ref<CoreRuleFormState>({ ...defaultFormState, });
  const isSubmitting = ref(false);
  const errorMessage = ref<string | null>(null);

  const canSubmit = computed(() => form.value.coreNm.trim() !== '');

  async function loadItem() {
    if (isCreateMode.value) return;

    const no = prjNo.value ?? (route.params.prjNo != null
      ? Number(route.params.prjNo)
      : null);
    const coreNo = coreNoNum.value;

    if (no == null || !Number.isInteger(no) || coreNo == null) {
      item.value = null;
      loadError.value = '프로젝트 또는 주요 설정 번호가 올바르지 않습니다.';
      return;
    }

    loadError.value = null;

    try {
      const response = await window.electron.api.getCoreRule(no, coreNo);

      if (response.error === true) {
        item.value = null;
        loadError.value = response.message ?? '주요 설정을 찾을 수 없습니다.';
        return;
      }

      const data = response.data ?? null;
      item.value = data;

      if (data) {
        form.value = {
          coreNm: data.coreNm ?? '',
          aplyScope: data.aplyScope ?? '',
          defDesc: data.defDesc ?? '',
          strcElem: data.strcElem ?? '',
          mechDesc: data.mechDesc ?? '',
          narrAply: data.narrAply ?? '',
          linkDocs: data.linkDocs ?? '',
          rmk: data.rmk ?? '',
          tags: data.tags ?? '',
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
        : '주요 설정을 불러오지 못했습니다.';
    }
  }

  function enterEditMode() {
    if (item.value) {
      form.value = {
        coreNm: item.value.coreNm ?? '',
        aplyScope: item.value.aplyScope ?? '',
        defDesc: item.value.defDesc ?? '',
        strcElem: item.value.strcElem ?? '',
        mechDesc: item.value.mechDesc ?? '',
        narrAply: item.value.narrAply ?? '',
        linkDocs: item.value.linkDocs ?? '',
        rmk: item.value.rmk ?? '',
        tags: item.value.tags ?? '',
      };
      errorMessage.value = null;
      isViewMode.value = false;
    }
  }

  function exitEditMode() {
    isViewMode.value = true;
    errorMessage.value = null;
  }

  function buildBody(): Partial<CoreRuleVo> {
    return {
      coreNm: form.value.coreNm.trim(),
      aplyScope: form.value.aplyScope.trim() || null,
      defDesc: form.value.defDesc.trim() || null,
      strcElem: form.value.strcElem.trim() || null,
      mechDesc: form.value.mechDesc.trim() || null,
      narrAply: form.value.narrAply.trim() || null,
      linkDocs: form.value.linkDocs.trim() || null,
      rmk: form.value.rmk.trim() || null,
      tags: form.value.tags.trim() || null,
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
        await window.electron.api.postCoreRule(no, body);
        queryClient.invalidateQueries({ queryKey: [ 'core-rules', no, ], });
        router.push({ name: 'project-core-rules', params: { prjNo: String(no), }, });
      }
      else {
        const coreNo = coreNoNum.value;
        if (coreNo == null) return;
        await window.electron.api.patchCoreRule(no, coreNo, body);
        queryClient.invalidateQueries({ queryKey: [ 'core-rules', no, ], });
        queryClient.invalidateQueries({ queryKey: [ 'core-rule', no, coreNo, ], });
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
    router.push({ name: 'project-core-rules', params: { prjNo: String(no), }, });
  }

  function onTagClick(_tag: string) {
    // TODO: 태그 검색 조회 연동
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
    onTagClick,
  };
}
