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

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva, useRoute, categoryItems)
// ═══════════════════════════════════════════════════════════════

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

const route = useRoute();

/** 사이드바 카테고리 설정 항목. 표시 순서는 PRD/TODO §0-1 기준. 라우트 name과 path로 메인 영역 전환. */
const categoryItems = [
  { label: '프로젝트 개요', path: 'overview', name: 'project-overview', icon: 'lucide:layout-dashboard', },
  { label: '전체 설정', path: 'settings', name: 'project-settings', icon: 'lucide:settings', },
  { label: '특성/능력 관리', path: 'traits-abilities', name: 'project-traits-abilities', icon: 'lucide:layers', },
  { label: '코어 설정', path: 'core-rules', name: 'project-core-rules', icon: 'lucide:book-open', },
  { label: '종족/생물', path: 'creatures', name: 'project-creatures', icon: 'lucide:dna', },
  { label: '인물', path: 'characters', name: 'project-characters', icon: 'lucide:users', },
  { label: '지역', path: 'regions', name: 'project-regions', icon: 'lucide:map-pin', },
  { label: '국가', path: 'nations', name: 'project-nations', icon: 'lucide:flag', },
  { label: '단체', path: 'organizations', name: 'project-organizations', icon: 'lucide:building-2', },
  { label: '도구', path: 'items', name: 'project-items', icon: 'lucide:package', },
  { label: '역사', path: 'events', name: 'project-events', icon: 'lucide:calendar-days', },
  { label: '신화/전설/설화', path: 'lores', name: 'project-lores', icon: 'lucide:scroll', },
] as const;

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

const projectStore = useProjectStore();

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

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

/** 자식 라우트에 project·prjNo 제공 (OverviewSection 등에서 inject) */
provide('project', project);
provide('prjNo', prjNoNum);

/** 현재 라우트 name과 일치하는 카테고리 활성 여부 */
function isActiveCategory(routeName: string) {
  return route.name === routeName;
}

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

watch(prjNoNum, loadProject, { immediate: true, });

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────

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
            <RouterLink
              :to="{ name: item.name, params: { prjNo: project!.prjNo } }"
              class="block w-full rounded-2 px-2 py-1.5 text-left text-sm transition-colors hover:bg-gray-100"
              :class="isActiveCategory(item.name) ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-700'"
            >
              <span class="inline-flex items-center gap-2">
                <VueIcon :icon-name="item.icon" class="size-4 shrink-0 text-gray-500" />
                {{ item.label }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </template>
    </aside>

    <!-- 우측: 카테고리별 설정 메인 영역 (라우트별 뷰 전환) -->
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
        <RouterView />
      </template>
      <template v-else>
        <p class="text-gray-500">
          로딩 중…
        </p>
      </template>
    </main>
  </div>
</template>
