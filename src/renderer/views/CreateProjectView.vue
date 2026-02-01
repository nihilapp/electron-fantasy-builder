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
    'flex h-full min-h-full flex-col items-center justify-center overflow-auto p-4',
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

const router = useRouter();
const projectStore = useProjectStore();

const form = ref({
  prjNm: '',
  genreType: '',
  prjDesc: '',
});
const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);

const canSubmit = computed(() => form.value.prjNm.trim() !== '');

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
    await projectStore.createProject(body);
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
</script>

<template>
  <div :class="cn(cssVariants({}), props.class)">
    <section class="w-full max-w-md rounded-2 border border-gray-200 bg-white p-6">
      <h1 class="text-h3 font-medium">
        프로젝트 생성
      </h1>
      <form class="mt-4 flex flex-col gap-4" @submit.prevent="submit">
        <div class="flex flex-col gap-1">
          <label for="prjNm" class="text-sm font-medium text-gray-700">
            프로젝트 이름 <span class="text-red-500">
              *
            </span>
          </label>
          <input
            id="prjNm"
            v-model="form.prjNm"
            type="text"
            class="rounded-2 border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            placeholder="프로젝트 이름을 입력하세요"
            required
          >
        </div>
        <div class="flex flex-col gap-1">
          <label for="genreType" class="text-sm font-medium text-gray-700">
            장르
          </label>
          <input
            id="genreType"
            v-model="form.genreType"
            type="text"
            class="rounded-2 border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            placeholder="예: 판타지, SF"
          >
        </div>
        <div class="flex flex-col gap-1">
          <label for="prjDesc" class="text-sm font-medium text-gray-700">
            설명
          </label>
          <textarea
            id="prjDesc"
            v-model="form.prjDesc"
            rows="3"
            class="rounded-2 border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            placeholder="프로젝트에 대한 간단한 설명"
          />
        </div>
        <p v-if="errorMessage" class="text-sm text-red-500">
          {{ errorMessage }}
        </p>
        <div class="flex gap-2">
          <button
            type="button"
            class="button-base button-outline-gray-500 text-sm flex flex-1 items-center justify-center gap-1.5 rounded-2 px-3 py-2 hover:border-red-500 hover:bg-red-500 hover:text-white"
            :disabled="isSubmitting"
            @click="router.back()"
          >
            <VueIcon icon-name="fa6-solid:xmark" class="size-4 shrink-0" />
            취소
          </button>
          <button
            type="submit"
            class="button-base text-sm flex flex-1 items-center justify-center gap-1.5 rounded-2 px-3 py-2 hover:bg-black-500"
            :disabled="!canSubmit || isSubmitting"
          >
            <VueIcon icon-name="lucide:plus" class="size-4 shrink-0" />
            {{ isSubmitting ? '생성 중…' : '생성' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
