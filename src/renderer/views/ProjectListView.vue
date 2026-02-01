<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { ProjectVo } from '@app-types/vo.types';
import { useProjectStore } from '~/stores/projectStore';
import { cn } from '~/utils/cn';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'flex h-full min-h-0 flex-row gap-0 overflow-hidden',
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const { projectList, isLoaded, hasProjects, } = storeToRefs(projectStore);

/** 쿼리 prjNo로 선택된 프로젝트 (숫자 파싱) */
const selectedPrjNo = computed(() => {
  const raw = route.query.prjNo;
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
});

/** 선택된 프로젝트 VO */
const selectedProject = computed<ProjectVo | null>(() => {
  const no = selectedPrjNo.value;
  if (no == null) return null;
  return projectList.value.find((p) => p.prjNo === no) ?? null;
});

const selectProject = (prjNo: number | null | undefined) => {
  if (prjNo == null) {
    router.replace({ path: '/project-list', query: {}, });
    return;
  }
  router.replace({ path: '/project-list', query: { prjNo: String(prjNo), }, });
};

onMounted(() => {
  projectStore.getProjectList();
});
</script>

<template>
  <div :class="cn(cssVariants({}), props.class)">
    <!-- 좌측: 프로젝트 생성 링크 + 프로젝트 목록 (별도 스크롤) -->
    <aside class="flex min-h-0 w-[300px] shrink-0 flex-col overflow-y-auto border-r border-gray-300 bg-white p-2">
      <nav class="flex flex-col gap-1">
        <RouterLink
          to="/create-project"
          class="rounded-2 px-2 py-1.5 text-left text-sm hover:bg-gray-100"
        >
          프로젝트 생성
        </RouterLink>
      </nav>
      <template v-if="!isLoaded">
        <p class="px-2 py-2 text-sm text-gray-500">
          로딩 중…
        </p>
      </template>
      <template v-else-if="!hasProjects">
        <p class="px-2 py-2 text-sm text-gray-500">
          등록된 프로젝트가 없습니다.
        </p>
      </template>
      <template v-else>
        <p class="px-2 py-1 text-xs text-gray-500">
          프로젝트 ({{ projectList.length }}개)
        </p>
        <ul class="flex flex-col gap-0.5">
          <li
            v-for="p in projectList"
            :key="p.prjNo ?? p.prjNm ?? ''"
            role="button"
            class="rounded-2 px-2 py-1.5 text-left text-sm transition-colors cursor-pointer hover:bg-gray-100"
            :class="selectedPrjNo === p.prjNo ? 'bg-gray-100 font-medium' : ''"
            @click="selectProject(p.prjNo)"
          >
            {{ p.prjNm ?? '(이름 없음)' }}
          </li>
        </ul>
      </template>
    </aside>

    <!-- 우측: 선택된 프로젝트 정보 (main, 별도 스크롤, 콘텐츠 정중앙) -->
    <main class="flex min-h-0 min-w-0 flex-1 shrink items-center justify-center overflow-auto p-4">
      <div class="flex min-h-full min-w-full flex-col items-center justify-center">
        <template v-if="selectedProject">
          <div class="w-full max-w-md rounded-2 border border-gray-200 bg-white p-4">
            <h2 class="text-h4 font-medium">
              {{ selectedProject.prjNm ?? '(이름 없음)' }}
            </h2>
            <dl class="mt-2 grid gap-1 text-sm">
              <template v-if="selectedProject.prjNo != null">
                <dt class="text-gray-500">
                  프로젝트 번호
                </dt>
                <dd>
                  {{ selectedProject.prjNo }}
                </dd>
              </template>
              <template v-if="selectedProject.prjDesc != null && selectedProject.prjDesc !== ''">
                <dt class="text-gray-500">
                  설명
                </dt>
                <dd>
                  {{ selectedProject.prjDesc }}
                </dd>
              </template>
              <template v-if="selectedProject.genreType != null && selectedProject.genreType !== ''">
                <dt class="text-gray-500">
                  장르
                </dt>
                <dd>
                  {{ selectedProject.genreType }}
                </dd>
              </template>
            </dl>
          </div>
        </template>
        <template v-else>
          <p class="text-gray-500">
            좌측 목록에서 프로젝트를 선택하세요.
          </p>
        </template>
      </div>
    </main>
  </div>
</template>
