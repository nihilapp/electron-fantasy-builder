<script setup lang="ts">
import { cn } from '~/utils/cn';

/** 재사용 가능한 폼 버튼. primary(저장/등록), secondary(취소/목록). */

interface Props {
  type?: 'submit' | 'button';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  /** primary일 때 로딩 중 아닐 때 문구 (예: 저장, 등록) */
  label?: string;
  /** primary일 때 로딩 중일 때 문구 (예: 저장 중…) */
  loadingLabel?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, defineEmits)
// ═══════════════════════════════════════════════════════════════

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

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

const isPrimary = computed(() => props.variant === 'primary');
const showDisabled = computed(() => (
  isPrimary.value && (props.disabled || props.loading)
));
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
    class="rounded-2 px-4 py-2 text-sm font-medium transition-colors"
    :class="cn(
      isPrimary
        ? 'text-white'
        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      isPrimary && (showDisabled
        ? 'cursor-not-allowed bg-gray-400'
        : 'bg-gray-800 hover:bg-gray-700'),
    )"
    @click="$emit('click')"
  >
    {{ buttonLabel }}
  </button>
</template>
