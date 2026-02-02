import { createRouter, createWebHashHistory } from 'vue-router';

import CreateProjectView from '~/views/CreateProjectView.vue';
import MainView from '~/views/MainView.vue';
import ProjectDetailView from '~/views/ProjectDetailView.vue';
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
    {
      path: '/project/:prjNo',
      name: 'project-detail',
      component: ProjectDetailView,
      props: true,
    },
  ],
});

export default router;
