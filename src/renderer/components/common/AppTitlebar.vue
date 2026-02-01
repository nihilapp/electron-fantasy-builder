<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/utils/cn';

import logoUrl from '../../assets/images/fantasy-builder-logo.png';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  title: string;
  class?: string;
}

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'flex flex-row items-center p-2 text-black-700 bg-white border-b border-gray-300 titlebar-drag',
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

const buttonClassNames = 'flex flex-row items-center justify-center p-2 hover:bg-gray-200 rounded-2 transition-colors duration-200 ease-in-out titlebar-btn';

const onClickMinimize = () => {
  window.electron.ipc.windowMinimize();
};

const onClickMaximizeRestore = () => {
  window.electron.ipc.windowMaximizeRestore();
};

const onClickClose = () => {
  window.electron.ipc.windowClose();
};
</script>

<template>
  <header :class="cn(cssVariants({}), props.class)" class="titlebar">
    <h1 class="flex flex-row gap-1 items-center text-lg flex-1 shrink-0 font-900 truncate leading-1">
      <img :src="logoUrl" alt="Fantasy Builder" class="size-8">
      <span class="uppercase">
        {{ props.title }}
      </span>
    </h1>

    <div class="flex items-center gap-1 shrink-0">
      <button type="button" :class="buttonClassNames" aria-label="최소화" @click="onClickMinimize">
        <VueIcon icon-name="fa6-solid:window-minimize" class="size-4" />
      </button>
      <button type="button" :class="buttonClassNames" aria-label="최대화/복구" @click="onClickMaximizeRestore">
        <VueIcon icon-name="fa6-solid:window-restore" class="size-4" />
      </button>
      <button
        type="button"
        :class="cn([
          buttonClassNames,
          'hover:bg-red-500 hover:text-white'
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
