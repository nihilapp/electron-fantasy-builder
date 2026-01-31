import { createRouter, createWebHashHistory } from 'vue-router';

import DbMode from '~/views/DbMode.vue';
import Health from '~/views/Health.vue';
import Home from '~/views/Home.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/health',
      name: 'Health',
      component: Health,
    },
    {
      path: '/db-mode',
      name: 'DbMode',
      component: DbMode,
    },
  ],
});

export default router;
