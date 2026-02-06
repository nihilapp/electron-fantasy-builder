<script setup lang="ts">
import type { CoreRuleVo } from '@app-types/vo.types';

/** 코어 설정 목록. 가로로 긴 카드에 제목(coreNm)·유형(aplyScope) 표시. */

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (inject prjNo, useRouter)
// ═══════════════════════════════════════════════════════════════

const router = useRouter();
const prjNo = inject<Ref<number | null>>('prjNo')!;

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

const list = ref<CoreRuleVo[]>([]);
const totalCnt = ref(0);
const loading = ref(false);
const errorMessage = ref<string | null>(null);

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

function goToAdd() {
  const no = prjNo.value;
  if (no == null) return;
  router.push({ name: 'project-core-rule-new', params: { prjNo: String(no), }, });
}

async function loadList() {
  const no = prjNo.value;
  if (no == null) return;
  errorMessage.value = null;
  loading.value = true;
  try {
    const response = await window.electron.api.getCoreRuleList(no, {
      page: 1,
      pageSize: 100,
    });
    list.value = response.data?.list ?? [];
    totalCnt.value = response.data?.totalCnt ?? 0;
  }
  catch (err) {
    errorMessage.value = err instanceof Error
      ? err.message
      : '목록을 불러오지 못했습니다.';
    list.value = [];
    totalCnt.value = 0;
  }
  finally {
    loading.value = false;
  }
}

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

watch(prjNo, loadList);

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────

onMounted(loadList);
onActivated(loadList);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-h5 font-medium text-gray-900">
        코어 설정
      </h2>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-2 border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        @click="goToAdd"
      >
        <VueIcon icon-name="lucide:plus" class="size-4" />
        추가
      </button>
    </div>

    <template v-if="loading">
      <p class="text-gray-500">
        로딩 중…
      </p>
    </template>

    <template v-else-if="errorMessage">
      <p class="text-red-600">
        {{ errorMessage }}
      </p>
    </template>

    <template v-else-if="list.length === 0">
      <p class="text-gray-500">
        등록된 코어 설정이 없습니다.
      </p>
    </template>

    <template v-else>
      <ul class="flex flex-col gap-2">
        <li
          v-for="(item, index) in list"
          :key="item.coreNo ?? item.rowNo ?? index"
          class="flex"
        >
          <article
            class="flex w-full flex-row items-center gap-4 rounded-2 border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <div class="min-w-0 flex-1">
              <h3 class="truncate text-sm font-medium text-gray-900">
                {{ item.coreNm ?? '—' }}
              </h3>
              <p class="mt-0.5 text-xs text-gray-500">
                유형: {{ item.aplyScope ?? '—' }}
              </p>
            </div>
          </article>
        </li>
      </ul>
    </template>
  </div>
</template>
