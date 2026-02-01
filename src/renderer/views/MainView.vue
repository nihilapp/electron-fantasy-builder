<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import { useProjectStore } from '~/stores/projectStore';
import { cn } from '~/utils/cn';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

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

const projectStore = useProjectStore();
const { isLoaded, hasProjects, } = storeToRefs(projectStore);
</script>

<template>
  <div :class="cn(cssVariants({}), props.class)">
    <!-- 로딩 중 -->
    <template v-if="!isLoaded">
      <p class="text-gray-500">
        로딩 중…
      </p>
    </template>

    <!-- 로딩 완료: 웰컴 + CTA -->
    <template v-else>
      <section class="flex max-w-md flex-col gap-4 rounded-2 border border-gray-200 bg-white p-6 text-center">
        <h1 class="text-h3 font-medium">
          Fantasy Builder
        </h1>
        <p class="text-sm text-gray-600">
          세계관과 캐릭터를 위한 프로젝트를 만들어 보세요.
        </p>
        <div class="flex flex-col gap-2">
          <RouterLink v-if="hasProjects" to="/project-list">
            <button
              class="button-base text-sm flex w-full items-center justify-center gap-1.5 rounded-2 px-3 py-2 hover:bg-black-500"
            >
              <VueIcon icon-name="lucide:folder-open" class="size-4 shrink-0" />
              프로젝트 관리
            </button>
          </RouterLink>
          <RouterLink to="/create-project">
            <button
              class="button-base text-sm flex w-full items-center justify-center gap-1.5 rounded-2 px-3 py-2"
              :class="hasProjects ? 'button-outline-gray-500 hover:bg-gray-100' : 'hover:bg-black-500'"
            >
              <VueIcon icon-name="lucide:plus" class="size-4 shrink-0" />
              프로젝트 생성
            </button>
          </RouterLink>
        </div>
      </section>
    </template>
  </div>
</template>
