<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import { useAuthStore } from '~/stores/authStore';
import { cn } from '~/utils/cn';

import SigninModal from './SigninModal.vue';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva, buttonClassNames)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  'flex items-center',
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

const authStore = useAuthStore();
const { user, isAuthenticated, } = storeToRefs(authStore);

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

const isSigninModalOpen = ref(false);
const isDropdownOpen = ref(false);

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

const openSignin = () => {
  isSigninModalOpen.value = true;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleSignout = async () => {
  await authStore.signout();
  isDropdownOpen.value = false;
};

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────
</script>

<template>
  <div :class="cn(cssVariants({}), props.class)">
    <!-- Logged In State -->
    <div v-if="isAuthenticated && user" class="relative">
      <button
        class="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted"
        @click="toggleDropdown"
      >
        <div class="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {{ user.userNm ? user.userNm[0].toUpperCase() : 'U' }}
        </div>
        <span class="text-sm font-medium">
          {{ user.userNm || user.userEml }}
        </span>
      </button>

      <!-- Dropdown (Simple implementation) -->
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 top-full mt-1 w-32 rounded-md border border-border bg-card p-1 shadow-md z-50"
      >
        <div class="px-2 py-1.5 text-xs text-muted-foreground border-b border-border mb-1">
          {{ user.userEml }}
        </div>
        <button
          class="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
          @click="handleSignout"
        >
          Signout
        </button>
      </div>

      <!-- Backdrop for dropdown -->
      <div
        v-if="isDropdownOpen"
        class="fixed inset-0 z-40"
        @click="isDropdownOpen = false"
      />
    </div>

    <!-- Logged Out State -->
    <button
      v-else
      class="rounded-md px-3 py-1 text-sm font-medium hover:bg-muted"
      @click="openSignin"
    >
      Signin
    </button>

    <SigninModal v-model:open="isSigninModalOpen" />
  </div>
</template>
