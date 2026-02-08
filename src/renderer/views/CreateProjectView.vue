<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { ProjectVo } from '@app-types/vo.types';
import { useProjectStore } from '~/stores/projectStore';
import { cn } from '~/utils/cn';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva, useRouter)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'flex h-full min-h-full flex-col items-center justify-center overflow-auto p-4',
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

const router = useRouter();

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

const projectStore = useProjectStore();
const { createProject, } = projectStore;

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

const form = ref({
  prjNm: '',
  genreType: '',
  prjDesc: '',
});

const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);

const canSubmit = computed(() => form.value.prjNm.trim() !== '');

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

/** @description 프로젝트 생성 API 호출 후 목록 페이지로 이동. */
const submit = async () => {
  if (!canSubmit.value || isSubmitting.value) return;

  errorMessage.value = null;
  isSubmitting.value = true;

  try {
    const body = {
      prjNm: form.value.prjNm.trim(),
      genreType: form.value.genreType.trim() || null,
      prjDesc: form.value.prjDesc.trim() || null,
    } as ProjectVo;

    await createProject(body);

    router.push('/project-list');
  }
  catch (e) {
    errorMessage.value = e instanceof Error
      ? e.message
      : '프로젝트 생성에 실패했습니다.';
  }
  finally {
    isSubmitting.value = false;
  }
};

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────

</script>

<template>
  <div :class="cn(cssVariants({}), props.class)">
    <section class="card-panel w-full max-w-md">
      <h1 class="type-section-title">
        프로젝트 생성
      </h1>
      <p class="type-muted mt-1">
        새로운 세계관을 위한 첫 걸음을 시작하세요.
      </p>
      <form class="mt-4 flex flex-col gap-4" @submit.prevent="submit">
        <FormInput
          id="prjNm"
          v-model="form.prjNm"
          label="프로젝트 이름"
          placeholder="프로젝트 이름을 입력하세요"
          :required="true"
        />
        <FormInput
          id="genreType"
          v-model="form.genreType"
          label="장르"
          placeholder="예: 판타지, SF, 무협"
        />
        <FormTextarea
          id="prjDesc"
          v-model="form.prjDesc"
          label="설명"
          placeholder="프로젝트에 대한 간단한 설명"
          :rows="3"
        />

        <p v-if="errorMessage" class="text-sm text-destructive">
          {{ errorMessage }}
        </p>

        <div class="flex gap-2">
          <CommonButton
            type="button"
            variant="secondary"
            :disabled="isSubmitting"
            label="취소"
            class="flex-1"
            @click="router.back()"
          >
            <template #icon>
              <VueIcon icon-name="fa6-solid:xmark" class="size-4 shrink-0" />
            </template>
          </CommonButton>
          <CommonButton
            type="submit"
            variant="primary"
            :disabled="!canSubmit"
            :loading="isSubmitting"
            label="생성"
            loading-label="생성 중…"
            class="flex-1"
          >
            <template #icon>
              <VueIcon icon-name="lucide:plus" class="size-4 shrink-0" />
            </template>
          </CommonButton>
        </div>
      </form>
    </section>
  </div>
</template>
