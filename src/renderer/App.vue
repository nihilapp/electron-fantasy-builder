<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class='min-h-dvh flex flex-col'>
    <nav class='border-b border-gray-200 px-4 py-2 flex gap-4'>
      <RouterLink to='/' class='text-gray-700 hover:text-gray-900'>
        Home
      </RouterLink>
      <RouterLink to='/health' class='text-gray-700 hover:text-gray-900'>
        Health
      </RouterLink>
      <RouterLink to='/db-mode' class='text-gray-700 hover:text-gray-900'>
        DB 모드
      </RouterLink>
    </nav>
    <main class='flex-1'>
      <RouterView />
    </main>
  </div>
</template>
