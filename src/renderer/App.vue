<script setup lang="ts">
import { RouterView } from 'vue-router';

import AppSidebar from '~/components/common/AppSidebar.vue';
import AppTitleBar from '~/components/common/AppTitlebar.vue';
</script>

<template>
  <AppTitleBar title='Fantasy Builder' />

  <div>
    <AppSidebar />
    <main>
      <RouterView />
    </main>
  </div>
</template>
