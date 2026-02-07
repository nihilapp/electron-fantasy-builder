<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { IconName } from '~/data/icon-name.generated';
import { cn } from '~/utils/cn';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  title?: string;
  description?: string;
  icon?: IconName;
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva, useRoute 등)
// ═══════════════════════════════════════════════════════════════

const props = withDefaults(defineProps<Props>(), {
  title: '데이터가 없습니다.',
  description: '새로운 항목을 추가해 보세요.',
  icon: 'lucide:inbox',
});

const cssVariants = cva(
  [
    'flex flex-col items-center justify-center p-8 text-center rounded-2 border border-dashed border-border bg-card/50 min-h-75',
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
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
      <VueIcon :icon-name="props.icon" class="size-6 text-muted-foreground" />
    </div>
    <h3 class="mt-4 text-lg font-semibold text-foreground">
      {{ props.title }}
    </h3>
    <p class="mt-2 text-sm text-muted-foreground max-w-sm text-balance">
      {{ props.description }}
    </p>
    <div class="mt-6">
      <slot name="actions" />
    </div>
  </div>
</template>
