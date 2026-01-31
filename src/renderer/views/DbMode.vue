<script setup lang="ts">
import { onMounted, ref } from 'vue';

type DbMode = 'local' | 'remote';

const dbMode = ref<DbMode | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const loadDbMode = async () => {
  if (!window.electron?.ipc?.getDbMode) {
    error.value = 'Electron IPC를 사용할 수 없습니다.';
    return;
  }

  isLoading.value = true;
  error.value = null;
  dbMode.value = null;

  try {
    const mode = await window.electron.ipc.getDbMode();
    dbMode.value = mode;
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    console.error('DB 모드 조회 실패:', err);
  }
  finally {
    isLoading.value = false;
  }
};

const modeLabel = (mode: DbMode): string => (mode === 'local' ? '로컬 (SQLite)' : '리모트 (Postgres)');

onMounted(() => {
  loadDbMode();
});
</script>

<template>
  <div class='p-8'>
    <h1 class='text-h1 font-bold mb-6'>
      DB 모드 (참고용)
    </h1>

    <p class='text-gray-600 mb-6'>
      현재 <code class='bg-gray-100 px-1 rounded'>
        config/app.json
      </code> 의
      <code class='bg-gray-100 px-1 rounded'>
        db.mode
      </code> 값입니다.
      실제 전환은 설정 파일 수정 후 앱 재시작이 필요합니다.
    </p>

    <div v-if='isLoading' class='text-gray-600'>
      로딩 중...
    </div>

    <div v-else-if='error' class='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
      {{ error }}
    </div>

    <div v-else-if='dbMode' class='space-y-2'>
      <p>
        <span class='font-semibold'>
          현재 모드:
        </span>
        <span
          :class="dbMode === 'local'
            ? 'bg-emerald-100 text-emerald-800 px-2 py-1 rounded'
            : 'bg-sky-100 text-sky-800 px-2 py-1 rounded'"
        >
          {{ modeLabel(dbMode) }}
        </span>
      </p>
    </div>
  </div>
</template>
