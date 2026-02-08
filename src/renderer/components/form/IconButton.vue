<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { IconName } from '~/data/icon-name.generated';
import { cn } from '~/utils/cn';

/**
 * 아이콘만 표시하는 버튼. 툴팁·접근성용 aria-label 필수.
 * 섹션 헤더의 "목록으로", "수정 모드로 전환" 등에 재사용.
 */

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  /** 표시할 아이콘 (IconName). */
  iconName: IconName;
  /** 접근성용 레이블 (필수). button aria-label·title에 사용. */
  a11yLabel: string;
  /** 툴팁 문구. 없으면 a11yLabel 사용. */
  title?: string;
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva/cssVariants 등)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'btn-icon flex items-center justify-center p-2',
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

defineEmits<{
  click: [];
}>();

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

const effectiveTitle = computed(() => props.title ?? props.a11yLabel);

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
    :class="cn(cssVariants({}), props.class)"
    :aria-label="props.a11yLabel"
    :title="effectiveTitle"
    @click="$emit('click')"
  >
    <VueIcon :icon-name="props.iconName" class="size-5 shrink-0" />
  </button>
</template>

<style scoped>
</style>
