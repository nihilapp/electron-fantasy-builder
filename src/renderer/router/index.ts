import { createRouter, createWebHashHistory } from 'vue-router';

import CreateProjectView from '~/views/CreateProjectView.vue';
import MainView from '~/views/MainView.vue';
import ProjectListView from '~/views/ProjectListView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: MainView,
    },
    {
      path: '/create-project',
      component: CreateProjectView,
    },
    {
      path: '/project-list',
      component: ProjectListView,
    },
  ],
});

export default router;
