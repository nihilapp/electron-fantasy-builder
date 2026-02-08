<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { CoreRuleListItemVo } from '@app-types/vo.types';
import { useDeleteCoreRule } from '~/composables/query/coreRule/useDeleteCoreRule';
import { useGetCoreRuleList } from '~/composables/query/coreRule/useGetCoreRuleList';
import { cn } from '~/utils/cn';

/** 주요 설정 목록. 가로로 긴 카드에 주요 설정 명(coreNm)·적용 범위(aplyScope) 표시. */

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva, inject prjNo, useRouter)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'flex min-h-0 flex-1 flex-col gap-4',
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

const router = useRouter();
const prjNo = inject<Ref<number | null>>('prjNo')!;

const {
  data: listResponse,
  isPending: loading,
  error: listError,
} = useGetCoreRuleList({ prjNo, });

const deleteCoreRuleMutation = useDeleteCoreRule();

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

const list = computed(() => listResponse.value?.data?.list ?? []);
const listErrorMessage = computed(() => {
  const err = listError.value;

  return err instanceof Error
    ? err.message
    : null;
});
/** 삭제 실패 시 메시지. 목록 로드 오류와 별도. */
const deleteError = ref<string | null>(null);
/** 템플릿에 표시할 오류 메시지 (목록 로드 또는 삭제) */
const errorMessage = computed(() => listErrorMessage.value ?? deleteError.value);

/** 즐겨찾기 토글 (로컬 상태, 1차 UI만). coreNo 집합 */
const favoriteSet = ref<Set<number>>(new Set());

/** 보호 토글 (로컬 상태, 1차 UI만). coreNo 집합 */
const protectedSet = ref<Set<number>>(new Set());

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

/**
 * @description 즐겨찾기 활성 여부 (coreNo 기준)
 * @param coreNo - 주요 설정 번호
 */
function isFavorite(coreNo: number | null | undefined) {
  return coreNo != null && favoriteSet.value.has(coreNo);
}

/**
 * @description 보호 활성 여부 (coreNo 기준)
 * @param coreNo - 주요 설정 번호
 */
function isProtected(coreNo: number | null | undefined) {
  return coreNo != null && protectedSet.value.has(coreNo);
}

/** @description 추가 화면으로 이동 */
function goToAdd() {
  const no = prjNo.value;

  if (no == null) return;

  router.push({ name: 'project-core-rule-new', params: { prjNo: String(no), }, });
}

/**
 * @description 주요 설정 상세(보기) 화면으로 이동
 * @param coreNo - 주요 설정 번호
 */
function goToView(coreNo: number | null | undefined) {
  const no = prjNo.value;

  if (no == null || coreNo == null) return;

  router.push({
    name: 'project-core-rule-detail',
    params: { prjNo: String(no), coreNo: String(coreNo), },
  });
}

/**
 * @description 주요 설정 수정 화면으로 이동 (진입 시 수정 모드)
 * @param coreNo - 주요 설정 번호
 */
function goToEdit(coreNo: number | null | undefined) {
  const no = prjNo.value;

  if (no == null || coreNo == null) return;

  router.push({
    name: 'project-core-rule-detail',
    params: { prjNo: String(no), coreNo: String(coreNo), },
    query: { mode: 'edit', },
  });
}

/**
 * @description 즐겨찾기 토글 (로컬 상태만 갱신)
 * @param coreNo - 주요 설정 번호
 * @param e - 클릭 이벤트
 */
function toggleFavorite(coreNo: number | null | undefined, e: Event) {
  e.preventDefault();
  e.stopPropagation();

  if (coreNo == null) return;

  const next = new Set(favoriteSet.value);

  if (next.has(coreNo)) next.delete(coreNo);
  else next.add(coreNo);

  favoriteSet.value = next;
}

/**
 * @description 보호 토글 (로컬 상태만 갱신)
 * @param coreNo - 주요 설정 번호
 * @param e - 클릭 이벤트
 */
function toggleProtected(coreNo: number | null | undefined, e: Event) {
  e.preventDefault();
  e.stopPropagation();

  if (coreNo == null) return;

  const next = new Set(protectedSet.value);

  if (next.has(coreNo)) next.delete(coreNo);
  else next.add(coreNo);

  protectedSet.value = next;
}

/**
 * @description 주요 설정 삭제 (확인 후 API 호출, 목록 재조회)
 * @param item - 삭제할 주요 설정 VO
 */
async function removeItem(item: CoreRuleListItemVo) {
  const no = prjNo.value;
  const coreNo = item.coreNo ?? null;

  if (no == null || coreNo == null) return;

  const confirmed = window.confirm(
    `"${item.coreNm ?? '이 주요 설정'}"을(를) 삭제할까요?`
  );

  if (!confirmed) return;

  try {
    await deleteCoreRuleMutation.mutateAsync({ prjNo: no, coreNo, });
    deleteError.value = null;
  }
  catch (err) {
    deleteError.value = err instanceof Error
      ? err.message
      : '삭제에 실패했습니다.';
  }
}

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────
</script>

<template>
  <div :class="cn(cssVariants({}), 'p-4', props.class)">
    <div class="flex items-center justify-between gap-2">
      <h2 class="type-section-title">
        주요 설정
      </h2>
      <CommonButton
        type="button"
        variant="primary"
        label="추가"
        @click="goToAdd"
      >
        <template #icon>
          <VueIcon icon-name="lucide:plus" class="size-4" />
        </template>
      </CommonButton>
    </div>

    <template v-if="loading">
      <p class="type-muted">
        로딩 중…
      </p>
    </template>

    <template v-else-if="errorMessage">
      <p class="type-body text-destructive">
        {{ errorMessage }}
      </p>
    </template>

    <template v-else-if="list.length === 0">
      <p class="type-muted">
        등록된 주요 설정이 없습니다.
      </p>
    </template>

    <template v-else>
      <ul class="flex flex-col gap-2">
        <li
          v-for="(item, index) in list"
          :key="item.coreNo ?? item.rowNo ?? index"
          class="flex"
        >
          <SettingItemCard
            :title="item.coreNm ?? '—'"
            category="주요 설정"
            :is-favorite="isFavorite(item.coreNo)"
            :is-protected="isProtected(item.coreNo)"
            @view="goToView(item.coreNo)"
            @edit="goToEdit(item.coreNo)"
            @toggle-favorite="toggleFavorite(item.coreNo, $event)"
            @toggle-protected="toggleProtected(item.coreNo, $event)"
            @delete="removeItem(item)"
          />
        </li>
      </ul>
    </template>
  </div>
</template>
