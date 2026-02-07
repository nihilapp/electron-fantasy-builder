<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import { useProjectStore } from '~/stores/projectStore';
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
    'w-75 shrink-0 min-w-0 border-r border-border bg-card p-2 text-card-foreground transition-colors duration-300',
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

const projectStore = useProjectStore();
const { isLoaded, hasProjects, } = storeToRefs(projectStore);

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

/** 프로젝트가 있을 때만 목록/관련 메뉴 노출. 추후 설정(settings) 스토어 추가 시 동일 패턴으로 hasSettings 반영 */
const showProjectNav = computed(() => isLoaded.value && hasProjects.value);

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
  <aside :class="cn(cssVariants({}), props.class)">
    <nav class="flex flex-col gap-1">
      <RouterLink
        v-if="showProjectNav"
        to="/project-list"
        class="btn-icon block text-left"
      >
        프로젝트 목록
      </RouterLink>
      <RouterLink
        to="/create-project"
        class="btn-icon block text-left"
      >
        프로젝트 생성
      </RouterLink>
      <!-- 추후 설정 스토어 연동 시: v-if="hasSettings" 등으로 설정 메뉴 노출 -->
    </nav>
  </aside>
</template>
