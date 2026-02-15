<script setup lang="ts">
import type { RegionVo } from '@app-types/vo.types';
import DetailField from '~/components/common/DetailField.vue';
import CommonButton from '~/components/form/CommonButton.vue';
import FormInput from '~/components/form/FormInput.vue';
import FormTextarea from '~/components/form/FormTextarea.vue';
import IconButton from '~/components/form/IconButton.vue';
import type { RegionFormState } from '~/composables/useRegionForm';

/** 지역 본문: 헤더 + 보기(DetailField) 또는 폼(등록/수정). */

const defaultFormReadonly: RegionFormState = {
  regionNm: '',
  regionType: '',
  explorStat: '',
  regionExpln: '',
  locDesc: '',
  climateEnv: '',
  terrainFeat: '',
  envSpec: '',
  funcFeat: '',
  dangerLvl: '',
  dangerFctr: '',
  inhabitInfo: '',
  unknownEntity: '',
  mainFclty: '',
  rsrcList: '',
  upRegionNo: '',
  ntnNo: '',
  loreType: '',
  subLoreType: '',
};

interface Props {
  isCreateMode: boolean;
  item: RegionVo | null;
  form: RegionFormState;
  isViewMode: boolean;
  errorMessage: string | null;
  canSubmit: boolean;
  isSubmitting: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'submit': [];
  'goToList': [];
  'enterEditMode': [];
  'exitEditMode': [];
  'update:form': [payload: { key: keyof RegionFormState; value: string }];
}>();

const formValue = computed(() => props.form ?? defaultFormReadonly);

function setForm(key: keyof RegionFormState, value: string) {
  emit('update:form', { key, value, });
}
</script>

<template>
  <section
    class="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto p-4"
    aria-label="컨텐츠"
  >
    <div v-if="isCreateMode" class="flex items-center justify-between gap-2 mb-4">
      <h2 class="type-section-title">
        지역 추가
      </h2>
      <IconButton
        icon-name="lucide:arrow-left"
        a11y-label="목록으로"
        @click="emit('goToList')"
      />
    </div>

    <div v-else class="flex items-center justify-between gap-2 mb-4">
      <h2 class="type-section-title font-900 text-blue-500">
        지역 상세
      </h2>
      <div class="flex items-center gap-1">
        <IconButton
          v-if="isViewMode"
          icon-name="lucide:settings"
          a11y-label="수정 모드로 전환"
          @click="emit('enterEditMode')"
        />
        <IconButton
          icon-name="lucide:arrow-left"
          a11y-label="목록으로"
          @click="emit('goToList')"
        />
      </div>
    </div>

    <template v-if="!isCreateMode && isViewMode && item">
      <div class="flex flex-col gap-4">
        <DetailField label="이름" :content="item.regionNm" :title-weight="true" />
        <DetailField label="유형" :content="item.regionType" />
        <DetailField label="탐사 상태" :content="item.explorStat" />
        <DetailField label="설명" :content="item.regionExpln" />
        <DetailField label="위치 설명" :content="item.locDesc" />
        <DetailField label="기후/환경" :content="item.climateEnv" />
        <DetailField label="지형적 특징" :content="item.terrainFeat" />
        <DetailField label="환경 특이사항" :content="item.envSpec" />
        <DetailField label="기능적 특징" :content="item.funcFeat" />
        <div class="grid grid-cols-2 gap-4">
          <DetailField label="위험도" :content="item.dangerLvl" />
          <DetailField label="위험 요소" :content="item.dangerFctr" />
        </div>
        <DetailField label="거주 정보" :content="item.inhabitInfo" />
        <DetailField label="미상의 존재" :content="item.unknownEntity" />
        <DetailField label="주요 시설" :content="item.mainFclty" />
        <DetailField label="자원 목록" :content="item.rsrcList" />
        <div class="grid grid-cols-2 gap-4">
          <DetailField label="상위 지역 번호" :content="item.upRegionNo != null ? String(item.upRegionNo) : null" />
          <DetailField label="국가 번호" :content="item.ntnNo != null ? String(item.ntnNo) : null" />
        </div>
        <DetailField label="로어 유형" :content="item.loreType" />
        <DetailField label="하위 로어 유형" :content="item.subLoreType" />
      </div>
    </template>

    <form
      v-else
      class="flex flex-col gap-4"
      @submit.prevent="emit('submit')"
    >
      <FormInput
        id="region-form-regionNm"
        :model-value="formValue.regionNm"
        label="이름"
        placeholder="지역 이름"
        :required="true"
        @update:model-value="setForm('regionNm', $event)"
      />
      <div class="grid grid-cols-2 gap-4">
        <FormInput
          id="region-form-regionType"
          :model-value="formValue.regionType"
          label="유형"
          placeholder="예: 도시, 던전, 숲"
          @update:model-value="setForm('regionType', $event)"
        />
        <FormInput
          id="region-form-explorStat"
          :model-value="formValue.explorStat"
          label="탐사 상태"
          placeholder="예: 알려짐, 미개척"
          @update:model-value="setForm('explorStat', $event)"
        />
      </div>
      <FormTextarea
        id="region-form-regionExpln"
        :model-value="formValue.regionExpln"
        label="설명"
        placeholder="지역에 대한 전반적인 설명"
        :rows="3"
        @update:model-value="setForm('regionExpln', $event)"
      />
      <FormInput
        id="region-form-locDesc"
        :model-value="formValue.locDesc"
        label="위치 설명"
        placeholder="어느 방향으로 어느 정도 거리에 있는지 등"
        @update:model-value="setForm('locDesc', $event)"
      />
      <FormInput
        id="region-form-climateEnv"
        :model-value="formValue.climateEnv"
        label="기후/환경"
        placeholder="예: 고온 다습, 한랭"
        @update:model-value="setForm('climateEnv', $event)"
      />
      <FormInput
        id="region-form-terrainFeat"
        :model-value="formValue.terrainFeat"
        label="지형적 특징"
        placeholder="예: 험준한 산맥, 넓은 평원"
        @update:model-value="setForm('terrainFeat', $event)"
      />
      <FormInput
        id="region-form-envSpec"
        :model-value="formValue.envSpec"
        label="환경 특이사항"
        placeholder="예: 마력 밀도 높음"
        @update:model-value="setForm('envSpec', $event)"
      />
      <FormInput
        id="region-form-funcFeat"
        :model-value="formValue.funcFeat"
        label="기능적 특징"
        placeholder="예: 상업 중심지, 군사 기지"
        @update:model-value="setForm('funcFeat', $event)"
      />
      <div class="grid grid-cols-2 gap-4">
        <FormInput
          id="region-form-dangerLvl"
          :model-value="formValue.dangerLvl"
          label="위험도"
          placeholder="예: 안전, 위험"
          @update:model-value="setForm('dangerLvl', $event)"
        />
        <FormInput
          id="region-form-dangerFctr"
          :model-value="formValue.dangerFctr"
          label="위험 요소"
          placeholder="예: 강력한 몬스터, 독기"
          @update:model-value="setForm('dangerFctr', $event)"
        />
      </div>
      <FormInput
        id="region-form-inhabitInfo"
        :model-value="formValue.inhabitInfo"
        label="거주 정보"
        placeholder="예: 엘프 마을, 소수의 탐사대"
        @update:model-value="setForm('inhabitInfo', $event)"
      />
      <FormInput
        id="region-form-unknownEntity"
        :model-value="formValue.unknownEntity"
        label="미상의 존재"
        placeholder="지역 내 소문이나 목격담 등"
        @update:model-value="setForm('unknownEntity', $event)"
      />
      <FormInput
        id="region-form-mainFclty"
        :model-value="formValue.mainFclty"
        label="주요 시설"
        placeholder="예: 신전, 마법 탑, 주점"
        @update:model-value="setForm('mainFclty', $event)"
      />
      <FormInput
        id="region-form-rsrcList"
        :model-value="formValue.rsrcList"
        label="자원 목록"
        placeholder="예: 철광석, 약초"
        @update:model-value="setForm('rsrcList', $event)"
      />
      <div class="grid grid-cols-2 gap-4">
        <FormInput
          id="region-form-upRegionNo"
          :model-value="formValue.upRegionNo"
          label="상위 지역 번호"
          placeholder="숫자 입력"
          @update:model-value="setForm('upRegionNo', $event)"
        />
        <FormInput
          id="region-form-ntnNo"
          :model-value="formValue.ntnNo"
          label="국가 번호"
          placeholder="숫자 입력"
          @update:model-value="setForm('ntnNo', $event)"
        />
      </div>
      <FormInput
        id="region-form-loreType"
        :model-value="formValue.loreType"
        label="로어 유형"
        @update:model-value="setForm('loreType', $event)"
      />
      <FormInput
        id="region-form-subLoreType"
        :model-value="formValue.subLoreType"
        label="하위 로어 유형"
        @update:model-value="setForm('subLoreType', $event)"
      />

      <p v-if="errorMessage" class="text-sm text-destructive">
        {{ errorMessage }}
      </p>
      <div class="flex gap-2">
        <CommonButton
          type="submit"
          variant="primary"
          :disabled="!canSubmit"
          :loading="isSubmitting"
          :label="isCreateMode ? '등록' : '저장'"
          :loading-label="isCreateMode ? '등록 중…' : '저장 중…'"
        >
          <template #icon>
            <VueIcon icon-name="lucide:save" class="size-4 shrink-0" />
          </template>
        </CommonButton>
        <CommonButton
          type="button"
          variant="secondary"
          label="취소"
          @click="isCreateMode ? emit('goToList') : emit('exitEditMode')"
        >
          <template #icon>
            <VueIcon icon-name="lucide:x" class="size-4 shrink-0" />
          </template>
        </CommonButton>
      </div>
    </form>
  </section>
</template>
