<script setup lang="ts">
import { RouterView } from 'vue-router';

import AppTitleBar from '~/components/common/AppTitlebar.vue';
import { useProjectStore } from '~/stores/projectStore';

const projectStore = useProjectStore();

onMounted(() => {
  projectStore.getProjectList();
});
</script>

<template>
  <div class="flex flex-col gap-0 h-dvh">
    <AppTitleBar title="Fantasy Builder" />
    <main class="flex-1 min-h-0 min-w-0 shrink overflow-hidden">
      <RouterView />
    </main>
  </div>
</template>
