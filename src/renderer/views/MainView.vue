<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import { useProjectStore } from '~/stores/projectStore';
import { cn } from '~/utils/cn';

import logoUrl from '../assets/images/fantasy-builder-logo.png';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva/cssVariants 등)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'flex h-full flex-col items-center justify-center gap-6 p-4',
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
    <!-- 로딩 중 -->
    <template v-if="!isLoaded">
      <p class="type-muted">
        로딩 중…
      </p>
    </template>

    <!-- 로딩 완료: 웰컴 히어로 + CTA (스타일 가이드: Display, Card, Primary/Secondary 버튼) -->
    <template v-else>
      <section class="card-panel flex max-w-md flex-col gap-6 p-8 text-center">
        <div class="flex justify-center">
          <img :src="logoUrl" alt="" class="size-40 object-contain" aria-hidden="true">
        </div>
        <h1 class="type-display">
          FANTASY BUILDER
        </h1>
        <p class="type-body">
          세계관과 캐릭터를 위한 프로젝트를 만들어 보세요.
        </p>
        <div class="flex flex-col gap-2">
          <RouterLink v-if="hasProjects" to="/project-list" class="w-full">
            <button class="btn-secondary w-full" type="button">
              <VueIcon icon-name="lucide:folder-open" class="size-4 shrink-0" />
              프로젝트 관리
            </button>
          </RouterLink>
          <RouterLink to="/create-project" class="w-full">
            <button class="btn-primary w-full" type="button">
              <VueIcon icon-name="lucide:plus" class="size-4 shrink-0" />
              프로젝트 생성
            </button>
          </RouterLink>
        </div>
      </section>
    </template>
  </div>
</template>
