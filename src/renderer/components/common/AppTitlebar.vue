<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/utils/cn';

import logoUrl from '../../assets/images/fantasy-builder-logo.png';
import AuthStatus from '../auth/AuthStatus.vue';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  title: string;
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva, buttonClassNames)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'flex flex-row items-center border-b border-border bg-card px-3 py-1.5 text-foreground titlebar-drag transition-colors duration-300',
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

const buttonClassNames = 'titlebar-btn flex flex-row items-center justify-center rounded-2 p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

/** @description 창 최소화 IPC 호출 */
const onClickMinimize = () => {
  window.electron.ipc.windowMinimize();
};

/** @description 창 최대화/복원 토글 IPC 호출 */
const onClickMaximizeRestore = () => {
  window.electron.ipc.windowMaximizeRestore();
};

/** @description 창 닫기 IPC 호출 */
const onClickClose = () => {
  window.electron.ipc.windowClose();
};

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────

</script>

<template>
  <header :class="cn(cssVariants({}), props.class)" class="titlebar">
    <h1 class="flex flex-row gap-2 items-center text-lg flex-1 shrink-0 font-black truncate leading-none tracking-tight">
      <img :src="logoUrl" alt="FANTASY BUILDER" class="size-6 object-contain">
      <span class="uppercase text-current">
        {{ props.title }}
      </span>
    </h1>

    <div class="flex items-center gap-1 shrink-0">
      <!-- Auth Status -->
      <AuthStatus />

      <!-- Theme Toggle -->
      <ToggleTheme />

      <div class="w-px h-3.5 bg-border mx-0.5" />

      <button type="button" :class="buttonClassNames" aria-label="최소화" @click="onClickMinimize">
        <VueIcon icon-name="fa6-solid:window-minimize" class="size-3" />
      </button>
      <button type="button" :class="buttonClassNames" aria-label="최대화/복구" @click="onClickMaximizeRestore">
        <VueIcon icon-name="fa6-solid:window-restore" class="size-3" />
      </button>
      <button
        type="button"
        :class="cn([
          buttonClassNames,
          'hover:bg-destructive hover:text-destructive-foreground'
        ])"
        aria-label="닫기"
        @click="onClickClose"
      >
        <VueIcon icon-name="fa6-solid:xmark" class="size-4" />
      </button>
    </div>
  </header>
</template>

<style scoped>

</style>
