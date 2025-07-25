import 'element-plus/theme-chalk/dark/css-vars.css';
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';
import 'vuepress-theme-hope/presets/squircle-blogger-avatar.scss';
import 'vuepress-theme-hope/presets/bounce-icon.scss';
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
      changeThemeFn(newVal);
    });
    onMounted(async () => {
      const { useElementPlusTheme } = await import('use-element-plus-theme');
      const { changeTheme } = useElementPlusTheme();
      changeThemeFn = changeTheme;
      changeThemeFn(color.value);
      setElementUIDark(isDarkMode.value);
    });
  },
  layouts: {
    Blog,
  },
});
