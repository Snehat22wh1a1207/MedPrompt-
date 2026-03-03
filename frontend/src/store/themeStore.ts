import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  loadTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggleTheme: () =>
    set((state) => {
      const newDark = !state.isDark;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newDark ? 'dark' : 'light');
        if (newDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { isDark: newDark };
    }),
  loadTheme: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      const isDark = saved === 'dark';
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
      set({ isDark });
    }
  },
}));
