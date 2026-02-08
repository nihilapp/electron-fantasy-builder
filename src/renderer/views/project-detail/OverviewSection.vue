<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { ProjectVo } from '@app-types/vo.types';
import IconButton from '~/components/form/IconButton.vue';
import { useProjectStore } from '~/stores/projectStore';
import { cn } from '~/utils/cn';

/** 프로젝트 개요: 기본 정보 보기/수정. 기본은 보기 모드, 톱니 버튼으로 수정 모드 전환. */

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (inject project, prjNo)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'flex min-h-0 flex-1 flex-col gap-6',
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

const project = inject<Ref<ProjectVo | null>>('project')!;
const prjNo = inject<Ref<number | null>>('prjNo')!;

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

const projectStore = useProjectStore();
const { updateProject, getProjectByNo, } = projectStore;

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

/** 보기 모드 true / 수정 모드 false */
const isViewMode = ref(true);

/** 수정 폼 (편집 시 project 값으로 동기화) */
const form = ref({
  prjNm: '',
  genreType: '',
  prjDesc: '',
  prjVer: '',
  prjExpln: '',
});

const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);

const canSave = computed(() => form.value.prjNm.trim() !== '');

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

/** @description 수정 모드로 전환 시 폼을 현재 project로 채움 */
function enterEditMode() {
  const p = project.value;

  if (p) {
    form.value = {
      prjNm: p.prjNm ?? '',
      genreType: p.genreType ?? '',
      prjDesc: p.prjDesc ?? '',
      prjVer: p.prjVer ?? '',
      prjExpln: p.prjExpln ?? '',
    };

    errorMessage.value = null;
    isViewMode.value = false;
  }
}

/** @description 수정 → 보기 모드 전환. 에러 메시지 초기화. */
function exitEditMode() {
  isViewMode.value = true;

  errorMessage.value = null;
}

/** @description 프로젝트 수정 API 호출 후 보기 모드로 전환. */
async function save() {
  const no = prjNo.value;

  if (no == null || !canSave.value || isSubmitting.value) return;

  errorMessage.value = null;
  isSubmitting.value = true;

  try {
    const body: Partial<ProjectVo> = {
      prjNm: form.value.prjNm.trim(),
      genreType: form.value.genreType.trim() || null,
      prjDesc: form.value.prjDesc.trim() || null,
      prjVer: form.value.prjVer.trim() || null,
      prjExpln: form.value.prjExpln.trim() || null,
    };

    await updateProject(no, body);

    project.value = await getProjectByNo(no) ?? null;

    isViewMode.value = true;
  }
  catch (err) {
    errorMessage.value = err instanceof Error
      ? err.message
      : '저장에 실패했습니다.';
  }
  finally {
    isSubmitting.value = false;
  }
}

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

/** 프로젝트가 바뀌면 폼 초기화 및 보기 모드로 */
watch(
  project,
  (p) => {
    if (p) {
      form.value = {
        prjNm: p.prjNm ?? '',
        genreType: p.genreType ?? '',
        prjDesc: p.prjDesc ?? '',
        prjVer: p.prjVer ?? '',
        prjExpln: p.prjExpln ?? '',
      };

      isViewMode.value = true;
    }
  },
  { immediate: true, }
);

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────

</script>

<template>
  <div :class="cn(cssVariants({}), 'p-4', props.class)">
    <div class="flex items-center justify-between gap-2">
      <h2 class="type-section-title">
        프로젝트 개요
      </h2>
      <IconButton
        v-if="isViewMode && project"
        icon-name="lucide:settings"
        a11y-label="수정 모드로 전환"
        @click="enterEditMode"
      />
    </div>

    <template v-if="!project">
      <p class="type-muted">
        프로젝트 정보가 없습니다.
      </p>
    </template>

    <template v-else>
      <!-- 보기 모드: DetailField로 라벨·내용 구분 표시 -->
      <template v-if="isViewMode">
        <div class="flex flex-col gap-4">
          <DetailField
            label="프로젝트 이름"
            :content="project.prjNm"
            :title-weight="true"
          />
          <DetailField
            label="장르"
            :content="project.genreType"
          />
          <DetailField
            label="간단 설명"
            :content="project.prjDesc"
          />
          <DetailField
            label="버전"
            :content="project.prjVer"
          />
          <DetailField
            label="상세 설명"
            :content="project.prjExpln"
          />
        </div>
      </template>

      <!-- 수정 모드: 폼 -->
      <form
        v-else
        class="flex flex-col gap-4"
        @submit.prevent="save"
      >
        <FormInput
          id="overview-prjNm"
          v-model="form.prjNm"
          label="프로젝트 이름"
          placeholder="프로젝트 이름"
          :required="true"
        />
        <FormInput
          id="overview-genreType"
          v-model="form.genreType"
          label="장르"
          placeholder="예: 판타지, SF"
        />
        <FormTextarea
          id="overview-prjDesc"
          v-model="form.prjDesc"
          label="간단 설명"
          placeholder="한 줄 요약"
          :rows="2"
          min-height-class="min-h-20"
        />
        <FormInput
          id="overview-prjVer"
          v-model="form.prjVer"
          label="버전"
          placeholder="예: 1.0.0"
        />
        <FormTextarea
          id="overview-prjExpln"
          v-model="form.prjExpln"
          label="상세 설명"
          placeholder="프로젝트에 대한 설명"
          :rows="4"
          min-height-class="min-h-40"
        />

        <p v-if="errorMessage" class="text-sm text-destructive">
          {{ errorMessage }}
        </p>

        <div class="flex gap-2">
          <CommonButton
            type="submit"
            variant="primary"
            :disabled="!canSave"
            :loading="isSubmitting"
            label="저장"
            loading-label="저장 중…"
          >
            <template #icon>
              <VueIcon icon-name="lucide:save" class="size-4 shrink-0" />
            </template>
          </CommonButton>
          <CommonButton
            type="button"
            variant="secondary"
            label="취소"
            @click="exitEditMode"
          >
            <template #icon>
              <VueIcon icon-name="lucide:x" class="size-4 shrink-0" />
            </template>
          </CommonButton>
        </div>
      </form>
    </template>
  </div>
</template>
