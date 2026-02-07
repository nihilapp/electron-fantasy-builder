<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/utils/cn';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  /** 표시할 제목 */
  title: string;
  /** 카테고리 라벨 (예: 코어 설정) */
  category: string;
  /** 즐겨찾기 활성 여부 */
  isFavorite?: boolean;
  /** 보호 활성 여부 */
  isProtected?: boolean;
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva, defineEmits)
// ═══════════════════════════════════════════════════════════════

const props = withDefaults(defineProps<Props>(), {
  isFavorite: false,
  isProtected: false,
});

const emit = defineEmits<{
  view: [];
  edit: [];
  toggleFavorite: [e: Event];
  toggleProtected: [e: Event];
  delete: [];
}>();

const cssVariants = cva(
  [
    'card-panel flex w-full flex-row items-start gap-3 transition-colors hover:border-border',
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
// ACTIONS — 변수를 제어하는 함수들 (버튼 클릭 시 emit)
// ─────────────────────────────────────────────────────────────

function onToggleFavorite(e: Event) {
  e.preventDefault();
  e.stopPropagation();
  emit('toggleFavorite', e);
}

function onToggleProtected(e: Event) {
  e.preventDefault();
  e.stopPropagation();
  emit('toggleProtected', e);
}

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────

</script>

<template>
  <article :class="cn(cssVariants({}), props.class)">
    <!-- 카테고리 + 제목 (같은 행, 카테고리 고정·제목만 늘어남) -->
    <div class="flex min-w-0 flex-1 flex-row items-start gap-3">
      <span
        class="shrink-0 inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
      >
        {{ props.category }}
      </span>
      <h3 class="type-body min-w-0 flex-1 truncate font-semibold text-foreground">
        {{ props.title }}
      </h3>
    </div>
    <!-- 컨트롤 영역 (우측 상단) — 보기 / 수정 / 즐겨찾기 / 보호 / 삭제 -->
    <div
      class="flex shrink-0 items-start gap-0.5"
      role="group"
      aria-label="목록 항목 컨트롤"
    >
      <button
        type="button"
        class="btn-icon flex size-8 shrink-0 items-center justify-center"
        aria-label="보기"
        title="보기"
        @click="emit('view')"
      >
        <VueIcon icon-name="lucide:eye" class="size-4" />
      </button>
      <button
        type="button"
        class="btn-icon flex size-8 shrink-0 items-center justify-center"
        aria-label="수정"
        title="수정"
        @click="emit('edit')"
      >
        <VueIcon icon-name="lucide:pencil" class="size-4" />
      </button>
      <button
        type="button"
        class="btn-icon flex size-8 shrink-0 items-center justify-center"
        :class="props.isFavorite ? 'text-amber-500 dark:text-amber-400' : ''"
        :aria-label="props.isFavorite ? '즐겨찾기 해제' : '즐겨찾기'"
        :title="props.isFavorite ? '즐겨찾기 해제' : '즐겨찾기'"
        @click="onToggleFavorite($event)"
      >
        <VueIcon
          icon-name="lucide:star"
          class="size-4"
          :class="props.isFavorite ? 'fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400' : ''"
        />
      </button>
      <button
        type="button"
        class="btn-icon flex size-8 shrink-0 items-center justify-center"
        :class="props.isProtected ? 'text-primary' : ''"
        :aria-label="props.isProtected ? '보호 해제' : '보호'"
        :title="props.isProtected ? '보호 해제' : '보호 (선택·삭제 제외)'"
        @click="onToggleProtected($event)"
      >
        <VueIcon icon-name="lucide:shield" class="size-4" />
      </button>
      <button
        type="button"
        class="btn-icon flex size-8 shrink-0 items-center justify-center hover:bg-destructive/20 hover:text-destructive"
        aria-label="삭제"
        title="삭제"
        @click="emit('delete')"
      >
        <VueIcon icon-name="lucide:trash-2" class="size-4" />
      </button>
    </div>
  </article>
</template>

<style scoped>
</style>
