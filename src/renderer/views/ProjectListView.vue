<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { ProjectVo } from '@app-types/vo.types';
import { useProjectStore } from '~/stores/projectStore';
import { cn } from '~/utils/cn';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva, useRoute 등)
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

const router = useRouter();
const route = useRoute();

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

const projectStore = useProjectStore();
const {
  projectList,
  isLoaded,
  hasProjects,
} = storeToRefs(projectStore);
const { getProjectList, } = projectStore;

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

/** @description 프로젝트 목록 라우트로 이동. prjNo가 있으면 쿼리로 전달해 선택 상태 반영. */
const selectProject = (prjNo: number | null | undefined) => {
  if (prjNo == null) {
    router.replace({
      path: '/project-list',
      query: {},
    });
    return;
  }

  router.replace({
    path: '/project-list',
    query: {
      prjNo: String(prjNo),
    },
  });
};

/** @description 사이드바 빈 영역 클릭 시 선택 해제(목록으로 이동). */
const onClickSidebarEmpty = () => {
  if (selectedPrjNo.value != null) {
    selectProject(null);
  }
};

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────

onMounted(() => {
  getProjectList();
});
</script>

<template>
  <div :class="cn(cssVariants({}), props.class)">
    <!-- 좌측: 사이드바 (스타일 가이드 — slate 배경, Ghost 링크) -->
    <aside
      class="flex min-h-0 w-75 shrink-0 flex-col overflow-y-auto border-r border-border bg-card p-2 transition-colors duration-300"
      @click.self="onClickSidebarEmpty"
    >
      <nav class="flex flex-col gap-0.5">
        <RouterLink
          to="/"
          class="btn-icon flex h-10 w-full items-center gap-1.5 rounded-2 px-3 text-left transition-colors hover:bg-accent/50 hover:text-foreground"
        >
          <VueIcon icon-name="lucide:house" class="size-4 shrink-0" />
          <span class="text-sm font-medium">
            첫 화면
          </span>
        </RouterLink>
        <RouterLink
          to="/create-project"
          class="btn-icon flex h-10 w-full items-center gap-1.5 rounded-2 px-3 text-left transition-colors hover:bg-accent/50 hover:text-foreground"
        >
          <VueIcon icon-name="lucide:plus" class="size-4 shrink-0" />
          <span class="text-sm font-medium">
            프로젝트 생성
          </span>
        </RouterLink>
      </nav>
      <template v-if="!isLoaded">
        <p class="type-muted px-2 py-2">
          로딩 중…
        </p>
      </template>
      <template v-else-if="!hasProjects">
        <p class="type-muted px-2 py-2">
          등록된 프로젝트가 없습니다.
        </p>
      </template>
      <template v-else>
        <p class="type-label px-2 py-1">
          프로젝트 ({{ projectList.length }}개)
        </p>
        <ul class="flex flex-col gap-0.5">
          <li
            v-for="p in projectList"
            :key="p.prjNo ?? p.prjNm ?? ''"
            class="group flex h-10 w-full cursor-pointer items-center gap-1 rounded-2 px-2 text-sm transition-colors hover:bg-accent/50"
            :class="selectedPrjNo === p.prjNo ? 'bg-accent font-semibold' : 'text-foreground'"
            @click="selectProject(p.prjNo)"
          >
            <div class="min-w-0 flex-1 truncate text-left">
              {{ p.prjNm ?? '(이름 없음)' }}
            </div>
            <RouterLink
              v-if="p.prjNo != null"
              :to="{ name: 'project-overview', params: { prjNo: String(p.prjNo) } }"
              class="btn-icon flex size-8 shrink-0 items-center justify-center rounded-2 opacity-0 transition-opacity hover:bg-background/50 group-hover:opacity-100"
              :class="selectedPrjNo === p.prjNo ? 'opacity-100' : ''"
              @click.stop
            >
              <VueIcon icon-name="lucide:settings" class="size-4 shrink-0" />
              <span class="sr-only">
                관리
              </span>
            </RouterLink>
          </li>
        </ul>
      </template>
    </aside>

    <!-- 우측: 선택된 프로젝트 카드 (card-panel, type 계층) -->
    <main class="flex min-h-0 min-w-0 flex-1 shrink items-center justify-center overflow-auto bg-background p-4 transition-colors duration-300">
      <div class="flex min-h-full min-w-full flex-col items-center justify-center">
        <template v-if="selectedProject">
          <div class="card-panel w-full max-w-md">
            <h2 class="type-section-title">
              {{ selectedProject.prjNm ?? '(이름 없음)' }}
            </h2>
            <dl class="mt-2 flex flex-col gap-3">
              <div class="flex flex-row gap-x-4">
                <template v-if="selectedProject.prjNo != null">
                  <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                    <dt class="type-label">
                      프로젝트 번호
                    </dt>
                    <dd class="type-body font-semibold text-foreground">
                      {{ selectedProject.prjNo }}
                    </dd>
                  </div>
                </template>
                <template v-if="selectedProject.genreType != null && selectedProject.genreType !== ''">
                  <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                    <dt class="type-label">
                      장르
                    </dt>
                    <dd class="type-body font-semibold text-foreground">
                      {{ selectedProject.genreType }}
                    </dd>
                  </div>
                </template>
              </div>
              <template v-if="selectedProject.prjDesc != null && selectedProject.prjDesc !== ''">
                <div class="flex flex-col gap-0.5">
                  <dt class="type-label">
                    설명
                  </dt>
                  <dd class="type-body font-semibold text-foreground">
                    {{ selectedProject.prjDesc }}
                  </dd>
                </div>
              </template>
            </dl>
            <div class="mt-4 border-t border-border pt-3">
              <RouterLink
                v-if="selectedProject.prjNo != null"
                #default="{ navigate }"
                :to="{ name: 'project-overview', params: { prjNo: String(selectedProject.prjNo) } }"
                custom
              >
                <CommonButton
                  type="button"
                  variant="primary"
                  label="관리"
                  class="w-full"
                  @click="navigate"
                >
                  <template #icon>
                    <VueIcon icon-name="lucide:settings" class="size-4 shrink-0" />
                  </template>
                </CommonButton>
              </RouterLink>
            </div>
          </div>
        </template>
        <template v-else>
          <p class="type-muted">
            좌측 목록에서 프로젝트를 선택하세요.
          </p>
        </template>
      </div>
    </main>
  </div>
</template>
