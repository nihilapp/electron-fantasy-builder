<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/utils/cn';

/**
 * 상세 영역 내부 레이아웃: 설정 본문(폼/보기) + 메타데이터(태그, 연관 설정 등).
 * 좌측 = 설정 본문(default slot).
 * 우측 = 메타(#meta slot, 예: SettingSidebar).
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
    <!-- 좌측: 설정 본문 (default slot) -->
    <div class="flex min-h-0 min-w-0 flex-2 flex-col overflow-auto">
      <slot />
    </div>

    <!-- 우측: 메타 (#meta slot) -->
    <div class="flex h-full min-h-0 w-80 shrink-0 flex-col overflow-hidden">
      <slot name="meta" />
    </div>
  </div>
</template>

<style scoped>
</style>
