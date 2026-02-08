import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';

import App from '~/App.vue';
import router from '~/router';
import '~/assets/styles/tailwind.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        /** 데이터가 fresh로 유지되는 시간(ms). 이 시간 동안은 자동 리페치 트리거되지 않음. */
        staleTime: 60_000,
        /** 캐시가 비사용 후 메모리에서 제거되기까지의 시간(ms). */
        gcTime: 1000 * 60 * 30, // 30분
        /** 마운트 시 자동 리페치 비활성화 — 리페치는 수동(refetch/invalidate)만. */
        refetchOnMount: false,
        /** 창 포커스 시 자동 리페치 비활성화. */
        refetchOnWindowFocus: false,
        /** 네트워크 재연결 시 자동 리페치 비활성화. */
        refetchOnReconnect: false,
      },
    },
  },
});
app.mount('#app');
