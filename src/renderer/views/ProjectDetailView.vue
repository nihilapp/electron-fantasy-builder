<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { ProjectVo } from '@app-types/vo.types';
import { useProjectStore } from '~/stores/projectStore';
import { cn } from '~/utils/cn';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
  /** 라우트 파라미터 (문자열) */
  prjNo?: string;
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
const projectStore = useProjectStore();

/** 라우트 prjNo 파라미터를 숫자로 파싱 */
const prjNoNum = computed(() => {
  const raw = props.prjNo;
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
});

/** 현재 프로젝트 (상세 조회 결과) */
const project = ref<ProjectVo | null>(null);
const projectLoadError = ref<string | null>(null);

const loadProject = async () => {
  const no = prjNoNum.value;
  if (no == null) {
    project.value = null;
    projectLoadError.value = '프로젝트 번호가 올바르지 않습니다.';
    return;
  }
  projectLoadError.value = null;
  try {
    const data = await projectStore.getProjectByNo(no);
    project.value = data ?? null;
    if (project.value == null) {
      projectLoadError.value = '프로젝트를 찾을 수 없습니다.';
    }
  }
  catch {
    project.value = null;
    projectLoadError.value = '프로젝트를 불러오는 중 오류가 발생했습니다.';
  }
};

watch(prjNoNum, loadProject, { immediate: true, });

/** 사이드바 카테고리 설정 항목 (추후 각 카테고리별 설정 뷰로 확장) */
const categoryItems = [
  { label: '기본 정보', path: 'basic', icon: 'lucide:info', },
  { label: '캐릭터', path: 'characters', icon: 'lucide:users', },
  { label: '세계관', path: 'world', icon: 'lucide:globe', },
  { label: '규칙', path: 'rules', icon: 'lucide:book-open', },
] as const;

/** 현재 선택된 카테고리 (추후 라우트/탭 연동) */
const activeCategory = ref<string>('basic');
</script>

<template>
  <div :class="cn(cssVariants({}), props.class)">
    <!-- 좌측: 카테고리 설정 사이드바 -->
    <aside class="flex min-h-0 w-[260px] shrink-0 flex-col overflow-y-auto border-r border-gray-300 bg-white p-2">
      <nav class="flex flex-col gap-0.5">
        <RouterLink
          :to="{ path: '/project-list', query: project?.prjNo != null ? { prjNo: String(project.prjNo) } : {} }"
          class="rounded-2 px-2 py-1.5 text-left text-sm text-gray-600 hover:bg-gray-100"
        >
          ← 목록으로
        </RouterLink>
      </nav>
      <template v-if="project">
        <p class="mt-2 px-2 py-1 text-xs font-medium uppercase tracking-wider text-gray-500">
          설정
        </p>
        <ul class="flex flex-col gap-0.5">
          <li
            v-for="item in categoryItems"
            :key="item.path"
            class="flex"
          >
            <button
              type="button"
              class="w-full rounded-2 px-2 py-1.5 text-left text-sm transition-colors hover:bg-gray-100"
              :class="activeCategory === item.path ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-700'"
              @click="activeCategory = item.path"
            >
              <span class="inline-flex items-center gap-2">
                <VueIcon :icon-name="item.icon" class="size-4 shrink-0 text-gray-500" />
                {{ item.label }}
              </span>
            </button>
          </li>
        </ul>
      </template>
    </aside>

    <!-- 우측: 카테고리별 설정 메인 영역 -->
    <main class="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto p-4">
      <template v-if="projectLoadError">
        <p class="text-gray-600">
          {{ projectLoadError }}
        </p>
        <RouterLink
          to="/project-list"
          class="mt-2 text-sm text-blue-600 underline hover:text-blue-700"
        >
          프로젝트 목록으로
        </RouterLink>
      </template>
      <template v-else-if="project">
        <h1 class="text-h4 font-medium">
          {{ project.prjNm ?? '(이름 없음)' }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ categoryItems.find((c) => c.path === activeCategory)?.label ?? '설정' }} 설정 영역입니다. (추후 구현)
        </p>
      </template>
      <template v-else>
        <p class="text-gray-500">
          로딩 중…
        </p>
      </template>
    </main>
  </div>
</template>
