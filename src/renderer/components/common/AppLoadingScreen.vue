<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/utils/cn';

/**
 * 앱 최초 기동 시 백엔드(DB·Hono) 준비 전에 보여 주는 로딩 전용 화면.
 * PRD §3.3 앱 기동 및 초기 로딩 UX.
 */

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (로딩 전용, props/cva 없음)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'flex h-dvh w-full flex-col items-center justify-center gap-6 bg-background p-4 transition-colors duration-300',
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
    <h1 class="type-display">
      FANTASY BUILDER
    </h1>
    <p class="type-muted">
      준비 중…
    </p>
    <VueIcon
      icon-name="lucide:loader-circle"
      class="size-14 shrink-0 animate-spin text-muted-foreground"
      aria-hidden="true"
    />
  </div>
</template>
