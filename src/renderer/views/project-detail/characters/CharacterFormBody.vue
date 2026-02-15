<script setup lang="ts">
import type { CharacterVo } from '@app-types/vo.types';
import DetailField from '~/components/common/DetailField.vue';
import CommonButton from '~/components/form/CommonButton.vue';
import FormInput from '~/components/form/FormInput.vue';
import IconButton from '~/components/form/IconButton.vue';
import type { CharacterFormState } from '~/composables/useCharacterForm';

/** 인물 본문: 헤더 + 보기(DetailField) 또는 폼(등록/수정). */

const defaultFormReadonly: CharacterFormState = {
  charNm: '',
  aliasNm: '',
  roleType: '',
  logline: '',
  narrFunc: '',
  raceNo: '',
  ntnNo: '',
  orgNo: '',
  orgRank: '',
  loreType: '',
  subLoreType: '',
};

interface Props {
  isCreateMode: boolean;
  item: CharacterVo | null;
  form: CharacterFormState;
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
  'update:form': [payload: { key: keyof CharacterFormState; value: string }];
}>();

const formValue = computed(() => props.form ?? defaultFormReadonly);

function setForm(key: keyof CharacterFormState, value: string) {
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
        인물 추가
      </h2>
      <IconButton
        icon-name="lucide:arrow-left"
        a11y-label="목록으로"
        @click="emit('goToList')"
      />
    </div>

    <div v-else class="flex items-center justify-between gap-2 mb-4">
      <h2 class="type-section-title font-900 text-blue-500">
        인물 상세
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
        <DetailField label="이름" :content="item.charNm" :title-weight="true" />
        <DetailField label="이칭/별명" :content="item.aliasNm" />
        <DetailField label="역할" :content="item.roleType" />
        <DetailField label="로그라인" :content="item.logline" />
        <DetailField label="서사적 기능" :content="item.narrFunc" />
        <DetailField label="종족 번호" :content="item.raceNo != null ? String(item.raceNo) : null" />
        <DetailField label="국가 번호" :content="item.ntnNo != null ? String(item.ntnNo) : null" />
        <DetailField label="단체 번호" :content="item.orgNo != null ? String(item.orgNo) : null" />
        <DetailField label="단체 직위" :content="item.orgRank" />
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
        id="character-form-charNm"
        :model-value="formValue.charNm"
        label="이름"
        placeholder="인물 이름"
        :required="true"
        @update:model-value="setForm('charNm', $event)"
      />
      <FormInput
        id="character-form-aliasNm"
        :model-value="formValue.aliasNm"
        label="이칭/별명"
        placeholder="이칭 또는 별명"
        @update:model-value="setForm('aliasNm', $event)"
      />
      <FormInput
        id="character-form-roleType"
        :model-value="formValue.roleType"
        label="역할"
        placeholder="예: 주인공, 조연"
        @update:model-value="setForm('roleType', $event)"
      />
      <FormInput
        id="character-form-logline"
        :model-value="formValue.logline"
        label="로그라인"
        placeholder="인물의 핵심 요약"
        @update:model-value="setForm('logline', $event)"
      />
      <FormInput
        id="character-form-narrFunc"
        :model-value="formValue.narrFunc"
        label="서사적 기능"
        placeholder="예: 조력자, 장애물"
        @update:model-value="setForm('narrFunc', $event)"
      />
      <div class="grid grid-cols-2 gap-4">
        <FormInput
          id="character-form-raceNo"
          :model-value="formValue.raceNo"
          label="종족 번호"
          placeholder="숫자 입력"
          @update:model-value="setForm('raceNo', $event)"
        />
        <FormInput
          id="character-form-ntnNo"
          :model-value="formValue.ntnNo"
          label="국가 번호"
          placeholder="숫자 입력"
          @update:model-value="setForm('ntnNo', $event)"
        />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <FormInput
          id="character-form-orgNo"
          :model-value="formValue.orgNo"
          label="단체 번호"
          placeholder="숫자 입력"
          @update:model-value="setForm('orgNo', $event)"
        />
        <FormInput
          id="character-form-orgRank"
          :model-value="formValue.orgRank"
          label="단체 직위"
          placeholder="예: 단장, 기사"
          @update:model-value="setForm('orgRank', $event)"
        />
      </div>
      <FormInput
        id="character-form-loreType"
        :model-value="formValue.loreType"
        label="로어 유형"
        placeholder=""
        @update:model-value="setForm('loreType', $event)"
      />
      <FormInput
        id="character-form-subLoreType"
        :model-value="formValue.subLoreType"
        label="하위 로어 유형"
        placeholder=""
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
