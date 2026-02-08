<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';
import type { RouteLocationRaw } from 'vue-router';

import { cn } from '~/utils/cn';

/** 카테고리별 설정 목록을 좌측 사이드바로 표시. 선택 항목 강조. 상세 화면에서 재사용. */

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva/cssVariants)
// ═══════════════════════════════════════════════════════════════

export interface CategoryListItem {
  id: number | string;
  label: string;
}

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  /** 사이드바 제목 (예: 주요 설정) */
  title: string;
  /** 목록 항목 (id, label). 부모가 API 조회 후 전달. */
  items: CategoryListItem[];
  /** 현재 선택된 항목 id (라우트와 일치하는 값) */
  selectedId?: number | string | null;
  /** 항목별 이동할 라우트. 부모가 prjNo 등 params 포함해 반환. */
  getTo: (item: CategoryListItem) => RouteLocationRaw;
  /** 목록 로딩 중이면 true. 있으면 목록 대신 "로딩 중…" 표시. */
  loading?: boolean;
  /** 에러 메시지. 있으면 목록 대신 메시지 표시. */
  errorMessage?: string | null;
  /** 있으면 상단에 "목록으로" 링크 표시 (해당 카테고리 목록 화면으로) */
  routeToList?: RouteLocationRaw | null;
  /** 있으면 상단에 "처음으로" 링크 표시 (프로젝트 개요 등) */
  routeToFirst?: RouteLocationRaw | null;
  class?: string;
}

const props = withDefaults(
  defineProps<Props>(),
  {
    selectedId: null,
    loading: false,
    errorMessage: null,
    routeToList: null,
    routeToFirst: null,
  }
);

const cssVariants = cva(
  [
    'flex min-h-0 w-65 shrink-0 flex-col overflow-y-auto border-r border-border bg-card p-2',
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

/**
 * @description 항목이 현재 선택 상태인지 여부
 * @param item - 목록 항목
 */
function isSelected(item: CategoryListItem): boolean {
  const sid = props.selectedId;

  if (sid == null) return false;

  return String(item.id) === String(sid);
}

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────

</script>

<template>
  <aside
    :class="cn(cssVariants({}), props.class)"
    aria-label="카테고리 설정 목록"
  >
    <nav
      v-if="routeToList != null || routeToFirst != null"
      class="flex flex-col gap-0.5"
    >
      <RouterLink
        v-if="routeToList != null"
        :to="routeToList"
        class="btn-icon flex h-10 w-full items-center gap-1.5 rounded-2 px-3 text-left text-sm transition-colors hover:bg-accent/50 hover:text-foreground"
      >
        <VueIcon icon-name="lucide:list" class="size-4 shrink-0" />
        <span class="font-medium">
          목록으로
        </span>
      </RouterLink>
      <RouterLink
        v-if="routeToFirst != null"
        :to="routeToFirst"
        class="btn-icon flex h-10 w-full items-center gap-1.5 rounded-2 px-3 text-left text-sm transition-colors hover:bg-accent/50 hover:text-foreground"
      >
        <VueIcon icon-name="lucide:house" class="size-4 shrink-0" />
        <span class="font-medium">
          처음으로
        </span>
      </RouterLink>
    </nav>
    <p class="type-label mt-2 px-2 py-1">
      {{ title }}
    </p>
    <p
      v-if="loading"
      class="type-muted px-2 pt-2"
    >
      로딩 중…
    </p>
    <p
      v-else-if="errorMessage"
      class="type-body px-2 pt-2 text-sm text-destructive"
    >
      {{ errorMessage }}
    </p>
    <ul
      v-else
      class="flex flex-col gap-0.5 pt-1"
    >
      <li
        v-for="(listItem, index) in items"
        :key="listItem.id ?? index"
        class="flex"
      >
        <RouterLink
          :to="getTo(listItem)"
          class="flex min-h-10 w-full items-center gap-2 rounded-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent/50 hover:text-foreground"
          :class="isSelected(listItem) ? 'bg-accent text-accent-foreground font-semibold' : 'text-foreground'"
        >
          {{ listItem.label }}
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>
