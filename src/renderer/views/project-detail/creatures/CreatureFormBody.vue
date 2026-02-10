<script setup lang="ts">
import type { CreatureVo } from '@app-types/vo.types';
import DetailField from '~/components/common/DetailField.vue';
import CommonButton from '~/components/form/CommonButton.vue';
import FormInput from '~/components/form/FormInput.vue';
import FormTextarea from '~/components/form/FormTextarea.vue';
import IconButton from '~/components/form/IconButton.vue';
import type { CreatureFormState } from '~/composables/useCreatureForm';

/** 종족/생물 본문: 헤더 + 보기(DetailField) 또는 폼(등록/수정). */

const defaultFormReadonly: CreatureFormState = {
  creatureNm: '',
  creatureType: '',
  dangerGrd: '',
  identStat: '',
  creatureExpln: '',
  loreType: '',
  subLoreType: '',
};

interface Props {
  isCreateMode: boolean;
  item: CreatureVo | null;
  form: CreatureFormState;
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
  'update:form': [payload: { key: keyof CreatureFormState; value: string }];
}>();

const formValue = computed(() => props.form ?? defaultFormReadonly);

function setForm(key: keyof CreatureFormState, value: string) {
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
        종족/생물 추가
      </h2>
      <IconButton
        icon-name="lucide:arrow-left"
        a11y-label="목록으로"
        @click="emit('goToList')"
      />
    </div>

    <div v-else class="flex items-center justify-between gap-2 mb-4">
      <h2 class="type-section-title font-900 text-blue-500">
        종족/생물 상세
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
        <DetailField label="이름" :content="item.creatureNm" :title-weight="true" />
        <DetailField label="유형" :content="item.creatureType" />
        <DetailField label="위험 등급" :content="item.dangerGrd" />
        <DetailField label="식별 상태" :content="item.identStat" />
        <DetailField label="설명" :content="item.creatureExpln" />
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
        id="creature-form-creatureNm"
        :model-value="formValue.creatureNm"
        label="이름"
        placeholder="종족/생물 이름"
        :required="true"
        @update:model-value="setForm('creatureNm', $event)"
      />
      <FormInput
        id="creature-form-creatureType"
        :model-value="formValue.creatureType"
        label="유형"
        placeholder="예: 인간형, 야수"
        @update:model-value="setForm('creatureType', $event)"
      />
      <FormInput
        id="creature-form-dangerGrd"
        :model-value="formValue.dangerGrd"
        label="위험 등급"
        placeholder="예: 낮음, 중간, 높음"
        @update:model-value="setForm('dangerGrd', $event)"
      />
      <FormInput
        id="creature-form-identStat"
        :model-value="formValue.identStat"
        label="식별 상태"
        placeholder="예: 알려짐, 미상"
        @update:model-value="setForm('identStat', $event)"
      />
      <FormTextarea
        id="creature-form-creatureExpln"
        :model-value="formValue.creatureExpln"
        label="설명"
        placeholder="종족/생물에 대한 설명"
        :rows="4"
        min-height-class="min-h-40"
        @update:model-value="setForm('creatureExpln', $event)"
      />
      <FormInput
        id="creature-form-loreType"
        :model-value="formValue.loreType"
        label="로어 유형"
        placeholder=""
        @update:model-value="setForm('loreType', $event)"
      />
      <FormInput
        id="creature-form-subLoreType"
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
