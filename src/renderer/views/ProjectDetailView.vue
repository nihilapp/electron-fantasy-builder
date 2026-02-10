<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { ProjectVo } from '@app-types/vo.types';
import ProjectMenuLayout from '~/components/layouts/ProjectMenuLayout.vue';
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
    'flex h-full min-h-0 min-w-0 flex-1 flex-row gap-0 overflow-hidden',
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
  { label: '주요 설정', path: 'core-rules', name: 'project-core-rules', icon: 'lucide:book-open', },
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
const { getProjectByNo, } = projectStore;

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

/**
 * 상세/등록 화면 여부. true이면 좌측 카테고리 사이드바를 숨기고,
 * 자식 뷰가 그리는 상세용 사이드바(목록으로·처음으로·항목 목록)만 표시한다.
 */
const ROUTES_WITH_DETAIL_LAYOUT = [
  'project-core-rule-detail',
  'project-core-rule-new',
  'project-creature-detail',
  'project-creature-new',
] as const;

const isDetailLayoutRoute = computed(() => {
  const name = route.name;

  if (typeof name !== 'string') return false;

  return (ROUTES_WITH_DETAIL_LAYOUT as readonly string[]).includes(name);
});

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

/** @description 라우트 prjNo로 프로젝트 1건 조회 후 project·projectLoadError 반영. */
const loadProject = async () => {
  const no = prjNoNum.value;

  if (no == null) {
    project.value = null;
    projectLoadError.value = '프로젝트 번호가 올바르지 않습니다.';
    return;
  }

  projectLoadError.value = null;

  try {
    const data = await getProjectByNo(no);

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
    <!-- 목록 화면: ProjectMenuLayout(좌측 카테고리 + 우측 메인) -->
    <template v-if="!isDetailLayoutRoute">
      <ProjectMenuLayout
        :project="project"
        :category-items="categoryItems"
        :active-route-name="route.name"
      >
        <template v-if="projectLoadError">
          <div class="p-4">
            <p class="type-muted">
              {{ projectLoadError }}
            </p>
            <RouterLink
              to="/project-list"
              class="mt-2 text-sm text-primary underline hover:text-primary/80"
            >
              프로젝트 목록으로
            </RouterLink>
          </div>
        </template>
        <template v-else-if="project">
          <RouterView />
        </template>
        <template v-else>
          <div class="p-4">
            <p class="type-muted">
              로딩 중…
            </p>
          </div>
        </template>
      </ProjectMenuLayout>
    </template>

    <!-- 상세 라우트: 메인 전체 폭 (카테고리 사이드바 없음) -->
    <template v-else>
      <main class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background transition-colors duration-300">
        <template v-if="projectLoadError">
          <div class="p-4">
            <p class="type-muted">
              {{ projectLoadError }}
            </p>
            <RouterLink
              to="/project-list"
              class="mt-2 text-sm text-primary underline hover:text-primary/80"
            >
              프로젝트 목록으로
            </RouterLink>
          </div>
        </template>
        <template v-else-if="project">
          <RouterView />
        </template>
        <template v-else>
          <div class="p-4">
            <p class="type-muted">
              로딩 중…
            </p>
          </div>
        </template>
      </main>
    </template>
  </div>
</template>
