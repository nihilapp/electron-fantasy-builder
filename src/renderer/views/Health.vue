<script setup lang="ts">

import type { HealthDto } from '@app-types/dto';
import type { ResponseType } from '@app-types/response.types';
import { onMounted, ref } from 'vue';

const health = ref<HealthDto | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const loadHealth = async () => {
  if (!window.electron?.api?.getHealth) {
    error.value = 'Electron API를 사용할 수 없습니다.';
    return;
  }

  isLoading.value = true;
  error.value = null;
  health.value = null;

  try {
    const response: ResponseType<HealthDto> = await window.electron.api.getHealth();

    if (response.error) {
      error.value = response.message || 'Health 조회 실패';
      return;
    }

    health.value = response.data;
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    console.error('Health 로드 실패:', err);
  }
  finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadHealth();
});
</script>

<template>
  <div class='p-8'>
    <h1 class='text-h1 font-bold mb-6'>
      Hono Health
    </h1>

    <div v-if='isLoading' class='text-gray-600'>
      로딩 중...
    </div>

    <div v-else-if='error' class='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
      {{ error }}
    </div>

    <div v-else-if='health' class='space-y-2'>
      <p>
        <span class='font-semibold'>
          status:
        </span> {{ health.status }}
      </p>
      <p>
        <span class='font-semibold'>
          timestamp:
        </span> {{ health.timestamp }}
      </p>
    </div>
  </div>
</template>
