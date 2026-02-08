<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { ProjectVo } from '@app-types/vo.types';
import type { IconName } from '~/data/icon-name.generated';
import { cn } from '~/utils/cn';

/**
 * 1차 뎁스 레이아웃: 프로젝트 진입 후 설정 목록이 보이는 페이지.
 * 좌측 = 설정 카테고리 사이드바(첫 화면, 목록으로, 설정 목록).
 * 우측 = 메인 콘텐츠(설정 목록 등, default slot).
 */

/** 카테고리 항목. 라벨·name·path·icon으로 사이드바 링크 구성. */
export interface ProjectMenuCategoryItem {
  label: string;
  name: string;
  path: string;
  icon: string;
}

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  /** 현재 프로젝트. null이면 설정 목록 비표시. */
  project: ProjectVo | null;
  /** 사이드바에 표시할 카테고리 목록. */
  categoryItems: readonly ProjectMenuCategoryItem[];
  /** 활성 카테고리 판별용 라우트 name. */
  activeRouteName: string | symbol | null | undefined;
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva/cssVariants 등)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'flex h-full min-h-0 min-w-0 flex-1 flex-row gap-0 overflow-hidden',
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

/** @description 현재 라우트 name과 일치하는 카테고리 활성 여부. */
function isActiveCategory(routeName: string) {
  const active = props.activeRouteName;

  return typeof active === 'string' && active === routeName;
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
  <div :class="cn(cssVariants({}), props.class)">
    <!-- 좌측: 설정 카테고리 사이드바 -->
    <aside class="flex min-h-0 w-65 shrink-0 flex-col overflow-y-auto border-r border-border bg-card p-2 transition-colors duration-300">
      <nav class="flex flex-col gap-0.5">
        <RouterLink
          to="/"
          class="btn-icon flex h-10 w-full items-center gap-1.5 rounded-2 px-3 text-left transition-colors hover:bg-accent/50 hover:text-foreground"
        >
          <VueIcon icon-name="lucide:house" class="size-4 shrink-0" />
          <span class="text-sm font-medium">
            첫 화면
          </span>
        </RouterLink>
        <RouterLink
          :to="{ path: '/project-list', query: project?.prjNo != null ? { prjNo: String(project.prjNo) } : {} }"
          class="btn-icon flex h-10 w-full items-center gap-1.5 rounded-2 px-3 text-left transition-colors hover:bg-accent/50 hover:text-foreground"
        >
          <span class="text-sm font-medium">
            ← 목록으로
          </span>
        </RouterLink>
      </nav>
      <template v-if="project">
        <p class="type-label mt-2 px-2 py-1">
          설정
        </p>
        <ul class="flex flex-col gap-0.5">
          <li
            v-for="item in categoryItems"
            :key="item.path"
            class="flex"
          >
            <RouterLink
              :to="{ name: item.name, params: { prjNo: project.prjNo } }"
              class="btn-icon flex h-10 w-full items-center gap-2 rounded-2 px-3 text-left transition-colors hover:bg-accent/50 hover:text-foreground"
              :class="isActiveCategory(item.name) ? 'bg-accent text-accent-foreground font-semibold' : ''"
            >
              <VueIcon :icon-name="(item.icon as IconName)" class="size-4 shrink-0" />
              <span class="text-sm">
                {{ item.label }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </template>
    </aside>

    <!-- 우측: 메인 콘텐츠 (default slot) -->
    <main class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background transition-colors duration-300">
      <slot />
    </main>
  </div>
</template>

<style scoped>
</style>
