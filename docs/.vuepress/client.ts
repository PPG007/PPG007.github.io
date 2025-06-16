import 'element-plus/theme-chalk/dark/css-vars.css';
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';
import { defineClientConfig } from 'vuepress/client';
import { useDarkMode } from 'vuepress-theme-hope/client';
import { onMounted, watch } from 'vue';
import { useThemeColor } from './scripts';

const setElementUIDark = (dark: boolean) => {
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export default defineClientConfig({
  setup() {
    let changeThemeFn = (color?: string): void => {}
    const { isDarkMode } = useDarkMode();
    const color = useThemeColor();
    watch(isDarkMode, () => {
      setElementUIDark(isDarkMode.value);
    });
    watch(color, (newVal) => {
      changeThemeFn(newVal);
    })
    onMounted(async () => {
      const { useElementPlusTheme } = await import('use-element-plus-theme');
      const { changeTheme } = useElementPlusTheme();
      changeThemeFn = changeTheme;
      changeThemeFn(color.value);
      setElementUIDark(isDarkMode.value);
    });
  },
});
