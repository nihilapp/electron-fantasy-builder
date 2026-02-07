<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import ContentHeader from '~/components/common/ContentHeader.vue';
import EmptyState from '~/components/common/EmptyState.vue';
import { useAbilityStore } from '~/stores/abilityStore';
import { useTraitStore } from '~/stores/traitStore';
import { cn } from '~/utils/cn';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva, useRoute 등)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'flex flex-col h-full overflow-hidden',
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

const traitStore = useTraitStore();
const {
  projectTraitList,
  isLoaded: isTraitLoaded,
} = storeToRefs(traitStore);
const { getProjectTraitList, } = traitStore;

const abilityStore = useAbilityStore();
const {
  projectAbilityList,
  isLoaded: isAbilityLoaded,
} = storeToRefs(abilityStore);
const { getProjectAbilityList, } = abilityStore;

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

/** ProjectDetailView에서 provide된 prjNo */
const prjNo = inject<Ref<number | null>>('prjNo', ref(null));

const activeTab = ref<'traits' | 'abilities'>('traits');

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

const loadData = async () => {
  if (prjNo.value == null) return;

  if (activeTab.value === 'traits') {
    await getProjectTraitList(prjNo.value);
  }
  else {
    await getProjectAbilityList(prjNo.value);
  }
};

const onCreateClick = () => {
  // TODO: 생성 모달 또는 페이지 이동
  console.log(`Create new ${activeTab.value}`);
};

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

watch(
  [ prjNo, activeTab, ],
  loadData,
  { immediate: true, }
);

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────

</script>

<template>
  <div :class="cn(cssVariants({}), 'p-4', props.class)">
    <ContentHeader
      :title="activeTab === 'traits' ? '특성 관리' : '능력(어빌리티) 관리'"
      :description="activeTab === 'traits' ? '프로젝트 전용 특성을 관리합니다.' : '프로젝트 전용 능력과 마법을 관리합니다.'"
    >
      <template #actions>
        <button
          class="btn-primary flex items-center gap-1.5"
          @click="onCreateClick"
        >
          <VueIcon icon-name="lucide:plus" class="size-4" />
          {{ activeTab === 'traits' ? '특성 추가' : '능력 추가' }}
        </button>
      </template>
    </ContentHeader>

    <!-- Tabs -->
    <div class="flex gap-1 border-b border-border bg-card px-2 mb-4 rounded-t-lg">
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium transition-colors border-b-2"
        :class="activeTab === 'traits'
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground'"
        @click="activeTab = 'traits'"
      >
        특성
      </button>
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium transition-colors border-b-2"
        :class="activeTab === 'abilities'
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground'"
        @click="activeTab = 'abilities'"
      >
        능력 (Abilities)
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto min-h-0 bg-background rounded-b-lg">
      <!-- Loading -->
      <div v-if="(activeTab === 'traits' && !isTraitLoaded) || (activeTab === 'abilities' && !isAbilityLoaded)" class="flex justify-center p-8">
        <VueIcon icon-name="lucide:loader-circle" class="size-8 animate-spin text-muted-foreground" />
      </div>

      <!-- Traits List -->
      <template v-else-if="activeTab === 'traits'">
        <div v-if="projectTraitList.length === 0">
          <EmptyState
            title="등록된 특성이 없습니다."
            description="새로운 특성을 추가하여 캐릭터나 종족에 부여해 보세요."
            icon="lucide:dna"
          />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
          <article
            v-for="trait in projectTraitList"
            :key="trait.traitNo ?? 0"
            class="card-panel flex flex-col gap-2 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div class="flex justify-between items-start">
              <h3 class="font-bold text-foreground truncate">
                {{ trait.traitNm }}
              </h3>
              <span class="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                {{ trait.traitMcls ?? '기타' }}
              </span>
            </div>
            <p class="text-sm text-muted-foreground line-clamp-3 h-[3em]">
              {{ trait.traitExpln || '설명이 없습니다.' }}
            </p>
          </article>
        </div>
      </template>

      <!-- Abilities List -->
      <template v-else>
        <div v-if="projectAbilityList.length === 0">
          <EmptyState
            title="등록된 능력이 없습니다."
            description="마법, 기술, 초능력 등 다양한 능력을 정의해 보세요."
            icon="lucide:zap"
          />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
          <article
            v-for="ability in projectAbilityList"
            :key="ability.abilityNo ?? 0"
            class="card-panel flex flex-col gap-2 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div class="flex justify-between items-start">
              <h3 class="font-bold text-foreground truncate">
                {{ ability.abilityNm }}
              </h3>
              <span class="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                {{ ability.abilityType ?? '일반' }}
              </span>
            </div>
            <p class="text-sm text-muted-foreground line-clamp-3 h-[3em]">
              {{ ability.abilityExpln || '설명이 없습니다.' }}
            </p>
            <div class="mt-auto flex gap-2 text-xs text-muted-foreground">
              <span v-if="ability.useCost">
                비용: {{ ability.useCost }}
              </span>
              <span v-if="ability.coolTime">
                쿨타임: {{ ability.coolTime }}s
              </span>
            </div>
          </article>
        </div>
      </template>
    </div>
  </div>
</template>
