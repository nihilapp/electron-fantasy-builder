<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { CoreRuleVo } from '@app-types/vo.types';
import { cn } from '~/utils/cn';

/** 코어 설정 추가. 폼 제출 시 POST /core-rules, 성공 시 목록으로 이동. */

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (inject prjNo, useRouter)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'flex h-full min-h-0 flex-1 flex-col overflow-hidden',
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

const router = useRouter();
const prjNo = inject<Ref<number | null>>('prjNo')!;

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

const form = ref({
  coreNm: '',
  aplyScope: '',
  defDesc: '',
  strcElem: '',
  mechDesc: '',
  narrAply: '',
  linkDocs: '',
  rmk: '',
  tags: '',
});

const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);

const canSubmit = computed(() => form.value.coreNm.trim() !== '');

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

async function submit() {
  const no = prjNo.value;
  if (no == null || !canSubmit.value || isSubmitting.value) return;
  errorMessage.value = null;
  isSubmitting.value = true;
  try {
    const body: Partial<CoreRuleVo> = {
      coreNm: form.value.coreNm.trim(),
      aplyScope: form.value.aplyScope.trim() || null,
      defDesc: form.value.defDesc.trim() || null,
      strcElem: form.value.strcElem.trim() || null,
      mechDesc: form.value.mechDesc.trim() || null,
      narrAply: form.value.narrAply.trim() || null,
      linkDocs: form.value.linkDocs.trim() || null,
      rmk: form.value.rmk.trim() || null,
      tags: form.value.tags.trim() || null,
    };
    await window.electron.api.postCoreRule(no, body);
    router.push({ name: 'project-core-rules', params: { prjNo: String(no), }, });
  }
  catch (err) {
    errorMessage.value = err instanceof Error
      ? err.message
      : '등록에 실패했습니다.';
  }
  finally {
    isSubmitting.value = false;
  }
}

function goToList() {
  const no = prjNo.value;
  if (no == null) return;
  router.push({ name: 'project-core-rules', params: { prjNo: String(no), }, });
}

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────

</script>

<template>
  <div :class="cn(cssVariants({}), props.class)">
    <!-- 페이지 전체 등분: 좌(컨텐츠) / 우(공통 컬럼) — 헤더·폼은 좌측에만 -->
    <div class="flex min-h-0 flex-1 flex-row gap-0 overflow-hidden">
      <!-- 좌: 헤더 + 폼 컨텐츠 (2/3) -->
      <section
        class="flex min-h-0 min-w-0 flex-2 flex-col overflow-auto p-4"
        aria-label="컨텐츠"
      >
        <div class="flex items-center justify-between gap-2 mb-4">
          <h2 class="type-section-title">
            코어 설정 추가
          </h2>
          <button
            type="button"
            class="btn-secondary py-1.5 text-sm"
            @click="goToList"
          >
            ← 목록
          </button>
        </div>
        <form
          class="flex flex-col gap-4"
          @submit.prevent="submit"
        >
          <FormInput
            id="core-rule-coreNm"
            v-model="form.coreNm"
            label="제목"
            placeholder="코어 설정 제목"
            :required="true"
          />
          <FormInput
            id="core-rule-aplyScope"
            v-model="form.aplyScope"
            label="유형 (적용 범위)"
            placeholder="예: 전투, 마법"
          />
          <FormTextarea
            id="core-rule-defDesc"
            v-model="form.defDesc"
            label="정의·설명"
            placeholder="규칙 정의 또는 설명"
            :rows="4"
            min-height-class="min-h-40"
          />
          <FormInput
            id="core-rule-strcElem"
            v-model="form.strcElem"
            label="구조 요소"
            placeholder="규칙의 구조 요소"
          />
          <FormTextarea
            id="core-rule-mechDesc"
            v-model="form.mechDesc"
            label="메커니즘 설명"
            placeholder="메커니즘·동작 방식 설명"
            :rows="3"
          />
          <FormTextarea
            id="core-rule-narrAply"
            v-model="form.narrAply"
            label="서사·적용"
            placeholder="서사·스토리 적용 방법"
            :rows="3"
          />
          <FormInput
            id="core-rule-linkDocs"
            v-model="form.linkDocs"
            label="연결 문서"
            placeholder="참조 문서 URL 또는 경로"
          />
          <FormTextarea
            id="core-rule-rmk"
            v-model="form.rmk"
            label="비고"
            placeholder="기타 비고"
            :rows="2"
            min-height-class="min-h-16"
          />

          <p v-if="errorMessage" class="text-sm text-red-600">
            {{ errorMessage }}
          </p>

          <div class="flex gap-2">
            <FormButton
              type="submit"
              variant="primary"
              :disabled="!canSubmit"
              :loading="isSubmitting"
              label="등록"
              loading-label="등록 중…"
            />
            <FormButton
              type="button"
              variant="secondary"
              label="취소"
              @click="goToList"
            />
          </div>
        </form>
      </section>

      <!-- 우: 공통 컬럼 (1/3, 높이 전체) — 태그 -->
      <aside
        class="flex h-full min-h-0 w-80 shrink-0 flex-col overflow-y-auto border-l border-border bg-card p-4"
        aria-label="공통 컬럼"
      >
        <FormTextarea
          id="core-rule-add-tags"
          v-model="form.tags"
          label="태그"
          placeholder="쉼표 구분 등"
          :rows="4"
          min-height-class="min-h-24"
        />
      </aside>
    </div>
  </div>
</template>
