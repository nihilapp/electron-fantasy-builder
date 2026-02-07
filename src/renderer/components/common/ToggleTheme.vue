<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import { useCommonStore } from '~/stores/commonStore';
import { cn } from '~/utils/cn';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva/cssVariants 등)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'relative flex w-24 flex-row items-stretch rounded-full border border-border bg-secondary p-1 titlebar-btn transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
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

const commonStore = useCommonStore();
const { isDark, } = storeToRefs(commonStore);
const { toggleTheme, } = commonStore;

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
  <button
    type="button"
    role="switch"
    :aria-checked="isDark"
    :class="cn(
      cssVariants({}),
      props.class,
    )"
    @click="toggleTheme"
  >
    <!-- 슬라이딩 썸(활성 위치 표시) -->
    <span
      class="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full bg-primary transition-[left] duration-200 ease-out"
      :class="isDark ? 'left-[calc(50%+0.125rem)]' : 'left-1'"
      aria-hidden
    />
    <!-- 라이트(왼쪽) / 다크(오른쪽) 아이콘 -->
    <span
      class="relative z-10 flex flex-1 items-center justify-center rounded-full py-1 transition-colors duration-200"
      :class="isDark ? 'text-muted-foreground' : 'text-primary-foreground'"
    >
      <VueIcon icon-name="heroicons:sun" class="size-4 shrink-0" />
    </span>
    <span
      class="relative z-10 flex flex-1 items-center justify-center rounded-full py-1 transition-colors duration-200"
      :class="isDark ? 'text-primary-foreground' : 'text-muted-foreground'"
    >
      <VueIcon icon-name="heroicons:moon" class="size-4 shrink-0" />
    </span>
  </button>
</template>

<style scoped>
</style>
