import { createRouter, createWebHashHistory } from 'vue-router';

import CreateProjectView from '~/views/CreateProjectView.vue';
import MainView from '~/views/MainView.vue';
import CoreRuleFormSection from '~/views/project-detail/core-rules/CoreRuleFormSection.vue';
import CoreRulesSection from '~/views/project-detail/core-rules/CoreRulesSection.vue';
import CreatureFormSection from '~/views/project-detail/creatures/CreatureFormSection.vue';
import CreaturesSection from '~/views/project-detail/creatures/CreaturesSection.vue';
import OverviewSection from '~/views/project-detail/OverviewSection.vue';
import PlaceholderSection from '~/views/project-detail/PlaceholderSection.vue';
import SettingsUnifiedView from '~/views/project-detail/settings/SettingsUnifiedView.vue';
import TraitsAbilitiesSection from '~/views/project-detail/TraitsAbilitiesSection.vue';
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
      children: [
        {
          path: '',
          name: 'project-detail-index',
          redirect: (to) => ({ name: 'project-overview', params: { prjNo: to.params.prjNo, }, }),
        },
        {
          path: 'overview',
          name: 'project-overview',
          component: OverviewSection,
        },
        {
          path: 'settings',
          name: 'project-settings',
          component: SettingsUnifiedView,
        },
        {
          path: 'traits-abilities',
          name: 'project-traits-abilities',
          component: TraitsAbilitiesSection,
        },
        {
          path: 'core-rules',
          name: 'project-core-rules',
          component: CoreRulesSection,
        },
        {
          path: 'core-rules/new',
          name: 'project-core-rule-new',
          component: CoreRuleFormSection,
        },
        {
          path: 'core-rules/:coreNo',
          name: 'project-core-rule-detail',
          component: CoreRuleFormSection,
          props: true,
        },
        {
          path: 'creatures',
          name: 'project-creatures',
          component: CreaturesSection,
        },
        {
          path: 'creatures/new',
          name: 'project-creature-new',
          component: CreatureFormSection,
        },
        {
          path: 'creatures/:creatureNo',
          name: 'project-creature-detail',
          component: CreatureFormSection,
          props: true,
        },
        {
          path: 'characters',
          name: 'project-characters',
          component: PlaceholderSection,
          props: { sectionLabel: '인물', },
        },
        {
          path: 'regions',
          name: 'project-regions',
          component: PlaceholderSection,
          props: { sectionLabel: '지역', },
        },
        {
          path: 'nations',
          name: 'project-nations',
          component: PlaceholderSection,
          props: { sectionLabel: '국가', },
        },
        {
          path: 'organizations',
          name: 'project-organizations',
          component: PlaceholderSection,
          props: { sectionLabel: '단체', },
        },
        {
          path: 'items',
          name: 'project-items',
          component: PlaceholderSection,
          props: { sectionLabel: '도구', },
        },
        {
          path: 'events',
          name: 'project-events',
          component: PlaceholderSection,
          props: { sectionLabel: '역사', },
        },
        {
          path: 'lores',
          name: 'project-lores',
          component: PlaceholderSection,
          props: { sectionLabel: '신화/전설/설화', },
        },
      ],
    },
  ],
});

export default router;
