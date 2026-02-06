<script setup lang="ts">
import { cn } from '~/utils/cn';

/** 재사용 가능한 폼 여러 줄 입력. rows·minHeightClass로 크기 조절. 보기 모드(disabled) 시 회색 배경. */

interface Props {
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
  <div class="flex flex-col gap-1">
    <label :for="props.id" class="text-sm font-medium text-gray-700">
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">
        *
      </span>
    </label>
    <textarea
      :id="props.id"
      v-model="model"
      :rows="props.rows"
      :disabled="props.disabled"
      :class="cn(
        'resize-y rounded-2 border px-3 py-2 text-sm outline-none',
        resolvedMinHeight,
        props.disabled
          ? 'cursor-default border-gray-200 bg-gray-50 text-gray-900 read-only:bg-gray-50'
          : 'border-gray-300 bg-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500',
      )"
      :placeholder="props.placeholder"
    />
  </div>
</template>
