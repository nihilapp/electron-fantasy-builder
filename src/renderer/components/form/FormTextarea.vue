<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/utils/cn';

/** 재사용 가능한 폼 여러 줄 입력. rows·minHeightClass로 크기 조절. 보기 모드(disabled) 시 회색 배경, 수정 시 카드 배경(라이트/다크 대응). */

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  /** Tailwind min-height 클래스 (예: min-h-20, min-h-40). 기본 min-h-24 */
  minHeightClass?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, defineModel)
// ═══════════════════════════════════════════════════════════════

const props = withDefaults(
  defineProps<Props>(),
  { minHeightClass: 'min-h-24', rows: 3, }
);

const model = defineModel<string>({ default: '', });

const cssVariants = cva(
  [
    'w-full resize-y rounded-2 border px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground',
  ],
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed border-input bg-muted/80 text-muted-foreground opacity-80',
        false: 'border-input bg-card text-foreground focus:border-primary',
      },
    },
    defaultVariants: {
      disabled: false,
    },
    compoundVariants: [],
  }
);

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

const resolvedMinHeight = computed(() => props.minHeightClass ?? 'min-h-24');

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
  <div class="flex flex-col gap-1.5">
    <label :for="props.id" class="type-detail-label">
      {{ props.label }}
      <span v-if="props.required" class="text-destructive">
        *
      </span>
    </label>
    <textarea
      :id="props.id"
      v-model="model"
      :rows="props.rows"
      :disabled="props.disabled"
      :class="cn(
        cssVariants({ disabled: props.disabled }),
        resolvedMinHeight,
        props.class
      )"
      :placeholder="props.placeholder"
    />
  </div>
</template>
