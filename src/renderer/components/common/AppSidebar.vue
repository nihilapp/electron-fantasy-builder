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
    `w-[300px] shrink-0 min-w-0 bg-white border-r border-gray-300 p-2`,
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

const projectStore = useProjectStore();
const { isLoaded, hasProjects, } = storeToRefs(projectStore);

/** 프로젝트가 있을 때만 목록/관련 메뉴 노출. 추후 설정(settings) 스토어 추가 시 동일 패턴으로 hasSettings 반영 */
const showProjectNav = computed(() => isLoaded.value && hasProjects.value);
</script>

<template>
  <aside :class="cn(cssVariants({}), props.class)">
    <nav class="flex flex-col gap-1">
      <RouterLink
        v-if="showProjectNav"
        to="/project-list"
        class="rounded-2 px-2 py-1.5 text-left text-sm hover:bg-gray-100"
      >
        프로젝트 목록
      </RouterLink>
      <RouterLink
        to="/create-project"
        class="rounded-2 px-2 py-1.5 text-left text-sm hover:bg-gray-100"
      >
        프로젝트 생성
      </RouterLink>
      <!-- 추후 설정 스토어 연동 시: v-if="hasSettings" 등으로 설정 메뉴 노출 -->
    </nav>
  </aside>
</template>
