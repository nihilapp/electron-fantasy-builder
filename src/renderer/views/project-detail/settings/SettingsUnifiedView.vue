<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { UnifiedSettingItemVo } from '@app-types/vo.types';
import { SETTING_CATEGORY_LABELS, type SettingCategoryCode } from '@zod-schema/settingsSearch.schema';
import FormInput from '~/components/form/FormInput.vue';
import { useGetSettingsSearch } from '~/composables/query/settings/useGetSettingsSearch';
import { cn } from '~/utils/cn';

/** 전체 설정 통합 조회·검색. 모든 설정 테이블 항목을 한 목록에서 검색하고, 클릭 시 해당 상세로 이동. */

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva, inject prjNo, useRouter)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [ 'flex min-h-0 flex-1 flex-col gap-4', ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

const router = useRouter();
const prjNo = inject<Ref<number | null>>('prjNo')!;

const searchKeyword = ref('');
const selectedCategory = ref<string>('');
const page = ref(1);
const PAGE_SIZE = 20;

const searchParams = computed(() => ({
  q: searchKeyword.value.trim() || undefined,
  categories: selectedCategory.value.trim() || undefined,
  page: page.value,
  pageSize: PAGE_SIZE,
}));

const {
  data: searchResponse,
  isPending: loading,
  error: listError,
} = useGetSettingsSearch({
  prjNo,
  params: searchParams,
  enabled: computed(() => prjNo.value != null),
});

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

const list = computed(() => searchResponse.value?.data?.list ?? []);
const totalCnt = computed(() => searchResponse.value?.data?.totalCnt ?? 0);
const totalPage = computed(() => searchResponse.value?.data?.totalPage ?? 1);
const errorMessage = computed(() => {
  const err = listError.value;
  return err instanceof Error
    ? err.message
    : null;
});

const categoryOptions = computed(() => {
  const all = Object.entries(SETTING_CATEGORY_LABELS).map(([ code, label, ]) => ({
    value: code,
    label,
  }));
  return [ { value: '', label: '전체 카테고리', }, ...all, ];
});

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

/**
 * 항목 클릭 시 해당 엔티티 상세(또는 목록) 라우트로 이동.
 * 상세 라우트가 구현된 카테고리만 상세로, 나머지는 목록으로.
 */
function goToItem(item: UnifiedSettingItemVo) {
  const no = prjNo.value;
  if (no == null) return;

  const prjNoStr = String(no);
  const cat = item.settingCategory as SettingCategoryCode;
  const noStr = String(item.settingNo);

  const routeMap: Partial<Record<SettingCategoryCode, { name: string; paramKey: string }>> = {
    CORE_RULE: { name: 'project-core-rule-detail', paramKey: 'coreNo', },
    CREATURE: { name: 'project-creature-detail', paramKey: 'creatureNo', },
  };

  const r = routeMap[cat];
  if (r) {
    router.push({
      name: r.name as 'project-core-rule-detail' | 'project-creature-detail',
      params: { prjNo: prjNoStr, [r.paramKey]: noStr, },
    });
  }
  else {
    const listNames: Partial<Record<SettingCategoryCode, string>> = {
      CHARACTER: 'project-characters',
      REGION: 'project-regions',
      NATION: 'project-nations',
      ORGANIZATION: 'project-organizations',
      ITEM: 'project-items',
      EVENT: 'project-events',
      LORE: 'project-lores',
    };
    const listName = listNames[cat];
    if (listName) {
      router.push({ name: listName as 'project-characters', params: { prjNo: prjNoStr, }, });
    }
  }
}

function onSearch() {
  page.value = 1;
  // useGetSettingsSearch는 searchParams가 바뀌면 자동 재조회됨
}

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────
</script>

<template>
  <div :class="cn(cssVariants({}), 'p-4', props.class)">
    <h2 class="type-section-title mb-4">
      전체 설정
    </h2>

    <div class="flex flex-wrap items-center gap-2 mb-4">
      <FormInput
        id="settings-search-q"
        v-model="searchKeyword"
        label="검색"
        placeholder="이름 또는 태그로 검색"
        class="min-w-48 max-w-xs"
        @keyup.enter="onSearch"
      />
      <select
        v-model="selectedCategory"
        class="rounded-2 border border-border bg-background px-3 py-2 text-foreground min-w-40"
        aria-label="카테고리 필터"
      >
        <option
          v-for="opt in categoryOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
      <CommonButton
        type="button"
        variant="primary"
        label="검색"
        @click="onSearch"
      >
        <template #icon>
          <VueIcon icon-name="lucide:search" class="size-4" />
        </template>
      </CommonButton>
    </div>

    <template v-if="loading">
      <p class="type-muted">
        로딩 중…
      </p>
    </template>
    <template v-else-if="errorMessage">
      <p class="type-body text-destructive">
        {{ errorMessage }}
      </p>
    </template>
    <template v-else-if="list.length === 0">
      <p class="type-muted">
        검색 결과가 없습니다.
      </p>
    </template>
    <template v-else>
      <ul class="flex flex-col gap-2">
        <li
          v-for="(item, index) in list"
          :key="`${item.settingCategory}-${item.settingNo}-${index}`"
          class="flex"
        >
          <SettingItemCard
            :title="item.displayName || '—'"
            :category="item.categoryLabel"
            :is-favorite="false"
            :is-protected="false"
            @view="goToItem(item)"
            @edit="goToItem(item)"
          />
        </li>
      </ul>
      <p v-if="totalPage > 1" class="type-muted mt-2">
        총 {{ totalCnt }}건 ({{ page }} / {{ totalPage }}페이지, {{ PAGE_SIZE }}건씩)
      </p>
    </template>
  </div>
</template>
