<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/utils/cn';

/** 재사용 가능한 공통 버튼. primary(저장/등록), secondary(취소/목록). */

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, defineEmits)
// ═══════════════════════════════════════════════════════════════

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
  type?: 'submit' | 'button';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  /** primary일 때 로딩 중 아닐 때 문구 (예: 저장, 등록) */
  label?: string;
  /** primary일 때 로딩 중일 때 문구 (예: 저장 중…) */
  loadingLabel?: string;
}

const props = withDefaults(
  defineProps<Props>(),
  {
    type: 'button',
    variant: 'primary',
    loading: false,
    label: '확인',
    loadingLabel: '처리 중…',
  }
);

defineEmits<{
  click: [];
}>();

const cssVariants = cva(
  [
    'inline-flex items-center justify-center gap-1 rounded-2 px-3 py-2 text-sm font-semibold transition-all disabled:opacity-50 active:scale-95',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20',
        secondary: 'border border-input bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:border-input/80',
      },
      disabledState: {
        true: 'cursor-not-allowed opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      disabledState: false,
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

const isPrimary = computed(() => props.variant === 'primary');

const effectiveDisabled = computed(() => (
  props.type === 'submit'
    ? (props.disabled || props.loading)
    : props.disabled
));

const buttonLabel = computed(() => (
  isPrimary.value && props.loading
    ? props.loadingLabel
    : props.label
));

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
    :type="props.type"
    :disabled="effectiveDisabled"
    :class="cn(
      cssVariants({
        variant: props.variant,
        disabledState: effectiveDisabled,
      }),
      isPrimary && effectiveDisabled ? 'bg-muted text-muted-foreground shadow-none hover:bg-muted' : '',
      props.class
    )"
    @click="$emit('click')"
  >
    <slot name="icon" />
    <span class="leading-1">
      {{ buttonLabel }}
    </span>
  </button>
</template>
