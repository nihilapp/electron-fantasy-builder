<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/utils/cn';

/** 상세 보기에서 라벨(부제) + 내용 블록을 한 묶음으로 표시. */

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva)
// ═══════════════════════════════════════════════════════════════

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  /** 부제(컬럼명) 문구 */
  label: string;
  /** 표시할 내용. null/빈 문자열이면 "—" 표시 */
  content?: string | null;
  /** 제목 행에 font-medium 적용 여부 (예: 주요 설정 명) */
  titleWeight?: boolean;
  class?: string;
}

const props = withDefaults(
  defineProps<Props>(),
  {
    content: null,
    titleWeight: false,
  }
);

const cssVariants = cva(
  [
    '',
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

const displayText = computed(() => {
  const v = props.content;

  return (v != null && String(v).trim() !== '')
    ? String(v).trim()
    : '—';
});

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
    <h3 class="type-detail-label mb-1">
      {{ label }}
    </h3>
    <p
      class="type-body rounded-2 border border-border bg-white px-3 py-2.5 whitespace-pre-wrap text-foreground text-justify"
      :class="titleWeight ? 'font-medium' : ''"
    >
      {{ displayText }}
    </p>
  </div>
</template>
