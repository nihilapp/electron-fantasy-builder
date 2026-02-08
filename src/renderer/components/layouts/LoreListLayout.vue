<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/utils/cn';

/**
 * 2차 뎁스 레이아웃: 설정(카테고리) 클릭 후 화면.
 * 좌측 = 해당 카테고리의 설정 리스트(#sidebar slot, 예: CategoryListSidebar).
 * 우측 = 상세 영역 전체(default slot, 본문+메타를 포함한 영역).
 * 데이터·네비게이션은 부모가 slot에 넘기고, 본 컴포넌트는 레이아웃만 담당.
 */

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva/cssVariants 등)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'flex min-h-0 flex-1 flex-row gap-0 overflow-hidden',
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
    <!-- 좌측: 카테고리별 설정 리스트 (sidebar slot) -->
    <div class="flex min-h-0 shrink-0 flex-col overflow-hidden">
      <slot name="sidebar" />
    </div>

    <!-- 우측: 상세 영역 (default slot) -->
    <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <slot />
    </div>
  </div>
</template>

<style scoped>
</style>
