<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/utils/cn';

/** 쉼표 구분 태그 문자열을 배열로 표시. 클릭 시 검색(추후 연동)용 이벤트 emit. */

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva/cssVariants)
// ═══════════════════════════════════════════════════════════════

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  /** 쉼표로 구분된 태그 문자열 */
  tags?: string | null;
  /** 제목(라벨) 문구. 기본 "태그" */
  label?: string;
  class?: string;
}

const props = withDefaults(
  defineProps<Props>(),
  {
    tags: '',
    label: '태그',
  }
);

const emit = defineEmits<{
  tagClick: [tag: string];
}>();

const cssVariants = cva(
  [ '', ],
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

/** 쉼표 구분 문자열을 trim 후 배열로 변환 (빈 문자열 제외) */
const tagList = computed(() => {
  const raw = props.tags;

  if (raw == null || String(raw).trim() === '') return [] as string[];

  return String(raw)
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
});

const hasTags = computed(() => tagList.value.length > 0);

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

/**
 * @description 태그 버튼 클릭 시 상위로 tagClick 이벤트를 전달한다.
 * @param tag - 클릭된 태그 문자열
 */
function onClickTag(tag: string) {
  emit('tagClick', tag);
}

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
    <div
      v-if="!hasTags"
      class="type-body rounded-2 border border-border bg-white px-3 py-2.5 text-muted-foreground"
    >
      —
    </div>
    <div
      v-else
      class="flex flex-wrap gap-1.5"
    >
      <button
        v-for="(tag, i) in tagList"
        :key="i"
        type="button"
        class="rounded-2 border border-border bg-card px-2.5 py-1 text-sm text-foreground transition-colors hover:bg-muted hover:border-primary/50"
        @click="onClickTag(tag)"
      >
        {{ tag }}
      </button>
    </div>
  </div>
</template>
