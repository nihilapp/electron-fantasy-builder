<script setup lang="ts">
import type { ExampleDto } from '@app-types/dto';
import type { ListResponseType } from '@app-types/response.types';
import { onMounted, ref } from 'vue';

const examples = ref<ExampleDto[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const loadExample = async () => {
  if (!window.electron?.api?.getExample) {
    error.value = 'Electron API를 사용할 수 없습니다.';
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const response: ListResponseType<ExampleDto> = await window.electron.api.getExample();

    if (response.error) {
      error.value = response.message || 'Example 목록 조회 실패';
      return;
    }

    examples.value = response.data.list;
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    console.error('Example 로드 실패:', err);
  }
  finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadExample();
});
</script>

<template>
  <div class='p-8'>
    <h1 class='text-h1 font-bold mb-6'>
      Example 목록
    </h1>

    <div v-if='isLoading' class='text-center py-8'>
      <p class='text-gray-600'>
        로딩 중...
      </p>
    </div>

    <div v-else-if='error' class='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
      <p class='font-semibold'>
        오류:
      </p>
      <p>{{ error }}</p>
    </div>

    <div v-else-if='examples.length === 0' class='text-center py-8'>
      <p class='text-gray-600'>
        Example이 없습니다.
      </p>
    </div>

    <div v-else class='space-y-4'>
      <div
        v-for='ex in examples'
        :key='ex.exNo'
        class='bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'
      >
        <h2 class='text-h5 font-semibold mb-2 text-gray-800'>
          {{ ex.exName }}
        </h2>
        <p v-if='ex.exDesc' class='text-gray-600 mb-3'>
          {{ ex.exDesc }}
        </p>
        <div class='text-sm text-gray-500'>
          exNo: {{ ex.exNo }}
        </div>
      </div>
    </div>
  </div>
</template>
