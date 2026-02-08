<script setup lang="ts">
import type { CoreRuleVo } from '@app-types/vo.types';
import DetailField from '~/components/common/DetailField.vue';
import CommonButton from '~/components/form/CommonButton.vue';
import FormInput from '~/components/form/FormInput.vue';
import FormTextarea from '~/components/form/FormTextarea.vue';
import IconButton from '~/components/form/IconButton.vue';
import type { CoreRuleFormState } from '~/composables/useCoreRuleForm';

/** 주요 설정 본문: 헤더 + 보기(DetailField 목록) 또는 폼(등록/수정). */

const defaultFormReadonly: CoreRuleFormState = {
  coreNm: '',
  aplyScope: '',
  defDesc: '',
  strcElem: '',
  mechDesc: '',
  narrAply: '',
  linkDocs: '',
  rmk: '',
  tags: '',
};

interface Props {
  isCreateMode: boolean;
  item: CoreRuleVo | null;
  /** 부모에서 ref를 넘기면 템플릿에서 자동 unwrap되어 객체로 전달됨 */
  form: CoreRuleFormState;
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
  'update:form': [payload: { key: keyof CoreRuleFormState; value: string }];
}>();

const formValue = computed(() => props.form ?? defaultFormReadonly);

function setForm(key: keyof CoreRuleFormState, value: string) {
  emit('update:form', { key, value, });
}
</script>

<template>
  <section
    class="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto p-4"
    aria-label="컨텐츠"
  >
    <!-- 등록: 제목 + 목록으로 -->
    <div v-if="isCreateMode" class="flex items-center justify-between gap-2 mb-4">
      <h2 class="type-section-title">
        주요 설정 추가
      </h2>
      <IconButton
        icon-name="lucide:arrow-left"
        a11y-label="목록으로"
        @click="emit('goToList')"
      />
    </div>

    <!-- 상세: 제목 + 수정/목록 버튼 -->
    <div v-else class="flex items-center justify-between gap-2 mb-4">
      <h2 class="type-section-title font-900 text-blue-500">
        주요 설정 상세
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

    <!-- 보기 모드 (상세일 때만) -->
    <template v-if="!isCreateMode && isViewMode && item">
      <div class="flex flex-col gap-4">
        <DetailField
          label="주요 설정 명"
          :content="item.coreNm"
          :title-weight="true"
        />
        <DetailField label="본질적 정의" :content="item.defDesc" />
        <DetailField label="적용 범위" :content="item.aplyScope" />
        <DetailField label="주요 설정 요소" :content="item.strcElem" />
        <DetailField label="작동 원리" :content="item.mechDesc" />
        <DetailField label="서사적 적용" :content="item.narrAply" />
        <DetailField label="비고" :content="item.rmk" />
      </div>
    </template>

    <!-- 폼 모드 (등록 또는 수정) -->
    <form
      v-else
      class="flex flex-col gap-4"
      @submit.prevent="emit('submit')"
    >
      <FormInput
        id="core-rule-form-coreNm"
        :model-value="formValue.coreNm"
        label="주요 설정 명"
        placeholder="주요 설정 명"
        :required="true"
        @update:model-value="setForm('coreNm', $event)"
      />
      <FormTextarea
        id="core-rule-form-defDesc"
        :model-value="formValue.defDesc"
        label="본질적 정의"
        placeholder="이 설정이 세계관에서 가지는 핵심적인 의미"
        :rows="4"
        min-height-class="min-h-40"
        @update:model-value="setForm('defDesc', $event)"
      />
      <FormTextarea
        id="core-rule-form-aplyScope"
        :model-value="formValue.aplyScope"
        label="적용 범위"
        placeholder="이 법칙이나 주요 설정이 영향을 미치는 범위"
        :rows="2"
        min-height-class="min-h-20"
        @update:model-value="setForm('aplyScope', $event)"
      />
      <FormTextarea
        id="core-rule-form-strcElem"
        :model-value="formValue.strcElem"
        label="주요 설정 요소"
        placeholder="하위 분류, 단계, 구성 요소"
        :rows="2"
        min-height-class="min-h-20"
        @update:model-value="setForm('strcElem', $event)"
      />
      <FormTextarea
        id="core-rule-form-mechDesc"
        :model-value="formValue.mechDesc"
        label="작동 원리"
        placeholder="세계 내에서 작동하는 구체적인 메커니즘"
        :rows="3"
        @update:model-value="setForm('mechDesc', $event)"
      />
      <FormTextarea
        id="core-rule-form-narrAply"
        :model-value="formValue.narrAply"
        label="서사적 적용"
        placeholder="이야기 전개에 미치는 영향"
        :rows="3"
        @update:model-value="setForm('narrAply', $event)"
      />
      <FormTextarea
        id="core-rule-form-rmk"
        :model-value="formValue.rmk"
        label="비고"
        placeholder="설정 메모"
        :rows="2"
        min-height-class="min-h-16"
        @update:model-value="setForm('rmk', $event)"
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
