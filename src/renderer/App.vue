<script setup lang="ts">
import { RouterView } from 'vue-router';

import AppLoadingScreen from '~/components/common/AppLoadingScreen.vue';
import AppTitleBar from '~/components/common/AppTitlebar.vue';
import { useAuthStore } from '~/stores/authStore';
import { useCommonStore } from '~/stores/commonStore';
import { useProjectStore } from '~/stores/projectStore';

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva, useRoute 등)
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

const commonStore = useCommonStore();
const { initTheme, } = commonStore;

const projectStore = useProjectStore();
const { getProjectList, } = projectStore;

const authStore = useAuthStore();
const { checkAuth, } = authStore;

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

/** @description 테스트용: true면 로딩 화면을 계속 표시. 기본 false. */
const FORCE_LOADING = false;

/** @description 앱(백엔드) 준비 완료 여부. false일 때 로딩 화면 표시 */
const appReady = ref(false);

/** @description 준비 완료 감지 실패 시 메시지. 있으면 로딩 대신 에러 안내 표시 */
const loadError = ref<string | null>(null);

/** @description Health 재시도 최대 횟수 */
const MAX_RETRIES = 10;

/** @description 재시도 간격(ms) */
const RETRY_DELAY_MS = 400;

/** @description 로딩 화면 최소 표시 시간(ms). 이 시간만큼은 AppLoadingScreen이 보이도록 유지 */
const MIN_LOADING_DISPLAY_MS = 500;

/** @description 로딩 시작 시각. 최소 표시 시간 계산용 */
const loadingStartedAt = ref(0);

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

/** @description Health API로 백엔드 준비 여부 확인. 성공 시 appReady = true 후 프로젝트 목록 로드. 로딩 화면은 최소 MIN_LOADING_DISPLAY_MS 동안 유지 후 전환. */
async function waitForAppReady() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await window.electron.api.getHealth();

      if (!FORCE_LOADING) {
        const elapsed = Date.now() - loadingStartedAt.value;

        if (elapsed < MIN_LOADING_DISPLAY_MS) {
          await new Promise((resolve) =>
            setTimeout(resolve, MIN_LOADING_DISPLAY_MS - elapsed)
          );
        }

        appReady.value = true;

        await Promise.all([
          getProjectList(),
          checkAuth(),
        ]);
      }

      return;
    }
    catch {
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
      else {
        loadError.value = '연결할 수 없습니다. 잠시 후 다시 시도해 주세요.';
      }
    }
  }
}

/** @description 에러 안내 화면에서 "다시 시도" 클릭 시 재시도. */
function retryLoad() {
  loadError.value = null;

  loadingStartedAt.value = Date.now();

  waitForAppReady();
}

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────

onMounted(() => {
  initTheme();

  loadingStartedAt.value = Date.now();

  waitForAppReady();
});
</script>

<template>
  <!-- 로딩 중: 백엔드 준비 전 -->
  <AppLoadingScreen v-if="!appReady && !loadError" />

  <!-- 준비 실패: 에러 메시지 + 다시 시도 -->
  <div
    v-else-if="loadError"
    class="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-card border border-border p-4"
  >
    <p class="type-muted">
      {{ loadError }}
    </p>
    <CommonButton
      type="button"
      variant="primary"
      label="다시 시도"
      @click="retryLoad"
    />
  </div>

  <!-- 준비 완료: 본문 -->
  <div
    v-else
    class="flex flex-col gap-0 h-dvh"
  >
    <AppTitleBar title="FANTASY BUILDER" />
    <main class="flex min-h-0 min-w-0 flex-1 flex-col shrink overflow-hidden">
      <RouterView />
    </main>
  </div>
</template>
