// @ts-expect-error -- resolved by Vite as a side-effect style import
import 'element-plus/theme-chalk/dark/css-vars.css';
// @ts-expect-error -- resolved by Vite as a side-effect style import
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';
// @ts-expect-error -- resolved by Vite as a side-effect style import
import 'vuepress-theme-hope/presets/squircle-blogger-avatar.scss';
// @ts-expect-error -- resolved by Vite as a side-effect style import
import 'vuepress-theme-hope/presets/bounce-icon.scss';
// @ts-expect-error -- resolved by Vite as a side-effect style import
import 'vuepress-theme-hope/presets/hr-driving-car.scss';
import { defineClientConfig } from 'vuepress/client';
import { onMounted, watch } from 'vue';
import { useThemeColor, useDarkMode } from './scripts';
import { Blog } from './layouts';

const setElementUIDark = (dark: boolean) => {
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export default defineClientConfig({
  setup() {
    let changeThemeFn: (color?: string) => void;
    const isDarkMode = useDarkMode();
    const color = useThemeColor();
    watch(isDarkMode, () => {
      setElementUIDark(isDarkMode.value);
    });
    watch(color, (newVal) => {
      if (!changeThemeFn) {
        return;
      }
      changeThemeFn(newVal);
    });
    onMounted(async () => {
      const { useElementPlusTheme } = await import('use-element-plus-theme');
      const { setRAGSearchThemeColor } = await import('@ppg007/vuepress-plugin-ragsearch/client')
      const { changeTheme } = useElementPlusTheme();
      changeThemeFn = (color?: string) => {
        if (!color) {
          return;
        }
        changeTheme(color);
        setRAGSearchThemeColor(color);
      };
      changeTheme(color.value);
      setElementUIDark(isDarkMode.value);
    });
  },
  layouts: {
    Blog,
  },
});
