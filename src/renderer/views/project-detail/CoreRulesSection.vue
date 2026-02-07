<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { CoreRuleVo } from '@app-types/vo.types';
import { cn } from '~/utils/cn';

/** 코어 설정 목록. 가로로 긴 카드에 제목(coreNm)·유형(aplyScope) 표시. */

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva, inject prjNo, useRouter)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'flex flex-col gap-4',
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

const router = useRouter();
const prjNo = inject<Ref<number | null>>('prjNo')!;

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

const list = ref<CoreRuleVo[]>([]);
const totalCnt = ref(0);
const loading = ref(false);
const errorMessage = ref<string | null>(null);

/** 즐겨찾기 토글 (로컬 상태, 1차 UI만). coreNo 집합 */
const favoriteSet = ref<Set<number>>(new Set());

/** 보호 토글 (로컬 상태, 1차 UI만). coreNo 집합 */
const protectedSet = ref<Set<number>>(new Set());

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

/**
 * @description 즐겨찾기 활성 여부 (coreNo 기준)
 * @param coreNo - 코어 설정 번호
 */
function isFavorite(coreNo: number | null | undefined) {
  return coreNo != null && favoriteSet.value.has(coreNo);
}

/**
 * @description 보호 활성 여부 (coreNo 기준)
 * @param coreNo - 코어 설정 번호
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
 * @description 코어 설정 상세(보기) 화면으로 이동
 * @param coreNo - 코어 설정 번호
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
 * @description 코어 설정 수정(상세) 화면으로 이동
 * @param coreNo - 코어 설정 번호
 */
function goToEdit(coreNo: number | null | undefined) {
  goToView(coreNo);
}

/**
 * @description 즐겨찾기 토글 (로컬 상태만 갱신)
 * @param coreNo - 코어 설정 번호
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
 * @param coreNo - 코어 설정 번호
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
 * @description 코어 설정 삭제 (확인 후 API 호출, 목록 재조회)
 * @param item - 삭제할 코어 설정 VO
 */
async function removeItem(item: CoreRuleVo) {
  const no = prjNo.value;
  const coreNo = item.coreNo ?? null;

  if (no == null || coreNo == null) return;

  const confirmed = window.confirm(
    `"${item.coreNm ?? '이 코어 설정'}"을(를) 삭제할까요?`
  );

  if (!confirmed) return;

  try {
    await window.electron.api.deleteCoreRule(no, coreNo);
    await loadList();
  }
  catch (err) {
    errorMessage.value = err instanceof Error
      ? err.message
      : '삭제에 실패했습니다.';
  }
}

/** @description 코어 설정 목록 조회 (prjNo 기준) */
async function loadList() {
  const no = prjNo.value;

  if (no == null) return;

  errorMessage.value = null;
  loading.value = true;

  try {
    const response = await window.electron.api.getCoreRuleList(no, {
      page: 1,
      pageSize: 100,
    });
    list.value = response.data?.list ?? [];
    totalCnt.value = response.data?.totalCnt ?? 0;
  }
  catch (err) {
    errorMessage.value = err instanceof Error
      ? err.message
      : '목록을 불러오지 못했습니다.';
    list.value = [];
    totalCnt.value = 0;
  }
  finally {
    loading.value = false;
  }
}

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

watch(prjNo, loadList);

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────

onMounted(loadList);
onActivated(loadList);
</script>

<template>
  <div :class="cn(cssVariants({}), 'p-4', props.class)">
    <div class="flex items-center justify-between gap-2">
      <h2 class="type-section-title">
        코어 설정
      </h2>
      <button
        type="button"
        class="btn-primary"
        @click="goToAdd"
      >
        <VueIcon icon-name="lucide:plus" class="size-4" />
        추가
      </button>
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
        등록된 코어 설정이 없습니다.
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
            category="코어 설정"
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
