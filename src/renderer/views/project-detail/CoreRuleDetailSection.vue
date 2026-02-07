<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { CoreRuleVo } from '@app-types/vo.types';
import { cn } from '~/utils/cn';

/** 코어 설정 상세. 보기 모드(기본) / 수정 모드 전환. */

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (inject prjNo, useRouter, useRoute)
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
const route = useRoute();
const prjNo = inject<Ref<number | null>>('prjNo')!;

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

/** 라우트 coreNo 파라미터를 숫자로 파싱 */
const coreNoNum = computed(() => {
  const raw = route.params.coreNo;
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
});

const item = ref<CoreRuleVo | null>(null);
const loadError = ref<string | null>(null);
const isViewMode = ref(true);

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

const canSave = computed(() => form.value.coreNm.trim() !== '');

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

async function loadItem() {
  const no = prjNo.value ?? (route.params.prjNo != null
    ? Number(route.params.prjNo)
    : null);
  const coreNo = coreNoNum.value;
  if (no == null || !Number.isInteger(no) || coreNo == null) {
    item.value = null;
    loadError.value = '프로젝트 또는 코어 설정 번호가 올바르지 않습니다.';
    return;
  }
  loadError.value = null;
  try {
    const response = await window.electron.api.getCoreRule(no, coreNo);
    if (response.error === true) {
      item.value = null;
      loadError.value = response.message ?? '코어 설정을 찾을 수 없습니다.';
      return;
    }
    const data = response.data ?? null;
    item.value = data;
    if (data) {
      form.value = {
        coreNm: data.coreNm ?? '',
        aplyScope: data.aplyScope ?? '',
        defDesc: data.defDesc ?? '',
        strcElem: data.strcElem ?? '',
        mechDesc: data.mechDesc ?? '',
        narrAply: data.narrAply ?? '',
        linkDocs: data.linkDocs ?? '',
        rmk: data.rmk ?? '',
        tags: data.tags ?? '',
      };
    }
  }
  catch (err) {
    item.value = null;
    loadError.value = err instanceof Error
      ? err.message
      : '코어 설정을 불러오지 못했습니다.';
  }
}

function enterEditMode() {
  if (item.value) {
    form.value = {
      coreNm: item.value.coreNm ?? '',
      aplyScope: item.value.aplyScope ?? '',
      defDesc: item.value.defDesc ?? '',
      strcElem: item.value.strcElem ?? '',
      mechDesc: item.value.mechDesc ?? '',
      narrAply: item.value.narrAply ?? '',
      linkDocs: item.value.linkDocs ?? '',
      rmk: item.value.rmk ?? '',
      tags: item.value.tags ?? '',
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
  const coreNo = coreNoNum.value;
  if (no == null || coreNo == null || !canSave.value || isSubmitting.value) return;
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
    await window.electron.api.patchCoreRule(no, coreNo, body);
    await loadItem();
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

function goToList() {
  const no = prjNo.value;
  if (no == null) return;
  router.push({ name: 'project-core-rules', params: { prjNo: String(no), }, });
}

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

watch(
  [ prjNo, coreNoNum, ],
  () => { loadItem(); },
  { immediate: true, }
);

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────

</script>

<template>
  <div :class="cn(cssVariants({}), props.class)">
    <template v-if="loadError">
      <p class="text-sm text-red-400">
        {{ loadError }}
      </p>
      <button
        type="button"
        class="btn-secondary mt-2"
        @click="goToList"
      >
        목록으로
      </button>
    </template>

    <template v-else-if="item">
      <!-- 페이지 전체 등분: 좌(컨텐츠) / 우(공통 컬럼, 전체 높이) -->
      <div class="flex min-h-0 flex-1 flex-row gap-0 overflow-hidden">
        <!-- 좌: 보기/수정 컨텐츠 (2/3) -->
        <section
          class="flex min-h-0 min-w-0 flex-2 flex-col overflow-auto p-4"
          aria-label="컨텐츠"
        >
          <div class="flex items-center justify-between gap-2 mb-4">
            <h2 class="type-section-title">
              코어 설정 상세
            </h2>
            <div class="flex items-center gap-1">
              <button
                v-if="isViewMode && item"
                type="button"
                class="btn-secondary py-1.5 text-sm"
                aria-label="수정 모드로 전환"
                @click="enterEditMode"
              >
                수정
              </button>
              <button
                type="button"
                class="btn-secondary py-1.5 text-sm"
                @click="goToList"
              >
                ← 목록
              </button>
            </div>
          </div>
          <!-- 보기 모드: 읽기 전용 -->
          <template v-if="isViewMode">
            <dl class="flex flex-col gap-3">
              <div>
                <dt class="type-label">
                  제목
                </dt>
                <dd class="type-body mt-0.5 font-medium text-foreground">
                  {{ item.coreNm ?? '—' }}
                </dd>
              </div>
              <div v-if="item.aplyScope != null && item.aplyScope !== ''">
                <dt class="type-label">
                  유형 (적용 범위)
                </dt>
                <dd class="type-body mt-0.5 text-foreground">
                  {{ item.aplyScope }}
                </dd>
              </div>
              <div v-if="item.defDesc != null && item.defDesc !== ''">
                <dt class="type-label">
                  정의·설명
                </dt>
                <dd class="type-body mt-0.5 whitespace-pre-wrap text-foreground">
                  {{ item.defDesc }}
                </dd>
              </div>
              <div v-if="item.strcElem != null && item.strcElem !== ''">
                <dt class="type-label">
                  구조 요소
                </dt>
                <dd class="type-body mt-0.5 text-foreground">
                  {{ item.strcElem }}
                </dd>
              </div>
              <div v-if="item.mechDesc != null && item.mechDesc !== ''">
                <dt class="type-label">
                  메커니즘 설명
                </dt>
                <dd class="type-body mt-0.5 whitespace-pre-wrap text-foreground">
                  {{ item.mechDesc }}
                </dd>
              </div>
              <div v-if="item.narrAply != null && item.narrAply !== ''">
                <dt class="type-label">
                  서사·적용
                </dt>
                <dd class="type-body mt-0.5 whitespace-pre-wrap text-foreground">
                  {{ item.narrAply }}
                </dd>
              </div>
              <div v-if="item.linkDocs != null && item.linkDocs !== ''">
                <dt class="type-label">
                  연결 문서
                </dt>
                <dd class="type-body mt-0.5 text-foreground">
                  {{ item.linkDocs }}
                </dd>
              </div>
              <div v-if="item.rmk != null && item.rmk !== ''">
                <dt class="type-label">
                  비고
                </dt>
                <dd class="type-body mt-0.5 whitespace-pre-wrap text-foreground">
                  {{ item.rmk }}
                </dd>
              </div>
            </dl>
          </template>

          <!-- 수정 모드: 폼 -->
          <form
            v-else
            class="flex flex-col gap-4"
            @submit.prevent="save"
          >
            <FormInput
              id="core-rule-detail-coreNm"
              v-model="form.coreNm"
              label="제목"
              placeholder="코어 설정 제목"
              :required="true"
            />
            <FormInput
              id="core-rule-detail-aplyScope"
              v-model="form.aplyScope"
              label="유형 (적용 범위)"
              placeholder="예: 전투, 마법"
            />
            <FormTextarea
              id="core-rule-detail-defDesc"
              v-model="form.defDesc"
              label="정의·설명"
              placeholder="규칙 정의 또는 설명"
              :rows="4"
              min-height-class="min-h-40"
            />
            <FormInput
              id="core-rule-detail-strcElem"
              v-model="form.strcElem"
              label="구조 요소"
              placeholder="규칙의 구조 요소"
            />
            <FormTextarea
              id="core-rule-detail-mechDesc"
              v-model="form.mechDesc"
              label="메커니즘 설명"
              placeholder="메커니즘·동작 방식 설명"
              :rows="3"
            />
            <FormTextarea
              id="core-rule-detail-narrAply"
              v-model="form.narrAply"
              label="서사·적용"
              placeholder="서사·스토리 적용 방법"
              :rows="3"
            />
            <FormInput
              id="core-rule-detail-linkDocs"
              v-model="form.linkDocs"
              label="연결 문서"
              placeholder="참조 문서 URL 또는 경로"
            />
            <FormTextarea
              id="core-rule-detail-rmk"
              v-model="form.rmk"
              label="비고"
              placeholder="기타 비고"
              :rows="2"
              min-height-class="min-h-16"
            />

            <p v-if="errorMessage" class="text-sm text-red-400">
              {{ errorMessage }}
            </p>

            <div class="flex gap-2">
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
        </section>

        <!-- 우: 공통 컬럼 (고정 폭, 높이 전체) — 태그 -->
        <aside
          class="flex h-full min-h-0 w-80 shrink-0 flex-col overflow-y-auto border-l border-border bg-card p-4"
          aria-label="공통 컬럼"
        >
          <template v-if="isViewMode">
            <p class="type-label mb-2 text-muted-foreground">
              태그
            </p>
            <p v-if="!(item?.tags != null && item.tags !== '')" class="type-muted text-sm">
              태그가 없습니다.
            </p>
            <p v-else class="type-body text-foreground whitespace-pre-wrap">
              {{ item?.tags }}
            </p>
          </template>
          <template v-else>
            <FormTextarea
              id="core-rule-detail-tags"
              v-model="form.tags"
              label="태그"
              placeholder="쉼표 구분 등"
              :rows="4"
              min-height-class="min-h-24"
            />
          </template>
        </aside>
      </div>
    </template>

    <template v-else>
      <p class="type-muted">
        로딩 중…
      </p>
    </template>
  </div>
</template>
