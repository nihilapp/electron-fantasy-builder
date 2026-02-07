const THEME_KEY = 'fb-theme-preference';

export const useCommonStore = defineStore('common', () => {
  // ─────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────
  const isDark = ref(false);

  // ─────────────────────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────────────────────

  /**
   * @description 테마 적용 로직.
   * - HTML 태그에 'dark' 클래스 토글
   * - 로컬 스토리지 저장
   * @param dark 다크 모드 여부
   */
  const applyTheme = (dark: boolean) => {
    isDark.value = dark;
    const html = document.documentElement;

    if (dark) {
      html.classList.add('dark');
    }
    else {
      html.classList.remove('dark');
    }

    localStorage.setItem(
      THEME_KEY,
      dark
        ? 'dark'
        : 'light'
    );
  };

  /**
   * @description 테마를 토글합니다.
   */
  const toggleTheme = () => {
    applyTheme(!isDark.value);
  };

  /**
   * @description 테마를 초기화합니다.
   */
  const initTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);

    if (stored) {
      applyTheme(stored === 'dark');
    }
    else {
      // 시스템 설정 감지 (선택 사항)
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemDark);
    }
  };

  return {
    isDark,
    toggleTheme,
    initTheme,
  };
});
