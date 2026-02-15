<script setup lang="ts">
import { ref } from 'vue';

import { useAuthStore } from '~/stores/authStore';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'success'): void;
}>();

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMsg = ref('');

const close = () => {
  emit('update:open', false);
  // 초기화
  email.value = '';
  password.value = '';
  errorMsg.value = '';
};

const onSubmit = async () => {
  if (!email.value || !password.value) {
    errorMsg.value = '이메일과 비밀번호를 입력해주세요.';
    return;
  }

  isLoading.value = true;
  errorMsg.value = '';

  try {
    const { success, message, } = await authStore.signin(email.value, password.value);
    if (success) {
      close();
      emit('success');
    }
    else {
      errorMsg.value = message || '로그인에 실패했습니다.';
    }
  }
  catch (_error) {
    errorMsg.value = '서버 오류가 발생했습니다.';
  }
  finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="close">
      <div class="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <h2 class="mb-4 text-xl font-bold">
          Signin
        </h2>

        <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
          <div>
            <label class="flex flex-col gap-1.5 text-sm font-medium">
              Email
              <input
                v-model="email"
                type="email"
                class="w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
            </label>
          </div>

          <div>
            <label class="flex flex-col gap-1.5 text-sm font-medium">
              Password
              <input
                v-model="password"
                type="password"
                class="w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
            </label>
          </div>

          <p v-if="errorMsg" class="text-sm text-destructive">
            {{ errorMsg }}
          </p>

          <div class="mt-2 flex justify-end gap-2">
            <button
              type="button"
              class="rounded px-4 py-2 text-sm font-medium hover:bg-muted"
              @click="close"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Signing in...' : 'Signin' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
