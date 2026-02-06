<script setup lang="ts">
import type { ProjectVo } from '@app-types/vo.types';
import { useProjectStore } from '~/stores/projectStore';

/** 프로젝트 개요: 기본 정보 보기/수정. 기본은 보기 모드, 톱니 버튼으로 수정 모드 전환. */

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (inject project, prjNo)
// ═══════════════════════════════════════════════════════════════

const project = inject<Ref<ProjectVo | null>>('project')!;
const prjNo = inject<Ref<number | null>>('prjNo')!;

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

const projectStore = useProjectStore();

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

/** 수정 모드로 전환 시 폼을 현재 project로 채움 */
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

function exitEditMode() {
  isViewMode.value = true;
  errorMessage.value = null;
}

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
    await projectStore.updateProject(no, body);
    project.value = await projectStore.getProjectByNo(no) ?? null;
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
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-h5 font-medium text-gray-900">
        프로젝트 개요
      </h2>
      <button
        v-if="isViewMode && project"
        type="button"
        class="rounded-2 p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        aria-label="수정 모드로 전환"
        @click="enterEditMode"
      >
        <VueIcon icon-name="lucide:settings" class="size-5" />
      </button>
    </div>

    <template v-if="!project">
      <p class="text-gray-500">
        프로젝트 정보가 없습니다.
      </p>
    </template>

    <template v-else>
      <!-- 보기: disabled input / 수정: 동일 input 활성화. 보기 상태 = 수정 불가 input. -->
      <form
        class="flex flex-col gap-4"
        @submit.prevent="save"
      >
        <FormInput
          id="overview-prjNm"
          v-model="form.prjNm"
          label="프로젝트 이름"
          placeholder="프로젝트 이름"
          :required="true"
          :disabled="isViewMode"
        />
        <FormInput
          id="overview-genreType"
          v-model="form.genreType"
          label="장르"
          placeholder="예: 판타지, SF"
          :disabled="isViewMode"
        />
        <FormTextarea
          id="overview-prjDesc"
          v-model="form.prjDesc"
          label="간단 설명"
          placeholder="한 줄 요약"
          :rows="2"
          min-height-class="min-h-20"
          :disabled="isViewMode"
        />
        <FormInput
          id="overview-prjVer"
          v-model="form.prjVer"
          label="버전"
          placeholder="예: 1.0.0"
          :disabled="isViewMode"
        />
        <FormTextarea
          id="overview-prjExpln"
          v-model="form.prjExpln"
          label="상세 설명"
          placeholder="프로젝트에 대한 설명"
          :rows="4"
          min-height-class="min-h-40"
          :disabled="isViewMode"
        />

        <p v-if="!isViewMode && errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <div v-if="!isViewMode" class="flex gap-2">
          <FormButton
            type="submit"
            variant="primary"
            :disabled="!canSave"
            :loading="isSubmitting"
            label="저장"
            loading-label="저장 중…"
          />
          <FormButton
            type="button"
            variant="secondary"
            label="취소"
            @click="exitEditMode"
          />
        </div>
      </form>
    </template>
  </div>
</template>
