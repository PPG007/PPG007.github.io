import 'element-plus/theme-chalk/dark/css-vars.css';
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';
import { defineClientConfig } from 'vuepress/client';
import { useDarkMode } from 'vuepress-theme-hope/client';
import { onMounted, watch } from 'vue';

const setElementUIDark = (dark: boolean) => {
  if (dark) {
    document.querySelector('html')?.classList.add('dark');
  } else {
    document.querySelector('html')?.classList.remove('dark');
  }
};

export default defineClientConfig({
  setup() {
    const { isDarkMode } = useDarkMode();
    watch(isDarkMode, () => {
      setElementUIDark(isDarkMode.value);
    });
    onMounted(() => {
      setElementUIDark(isDarkMode.value);
    });
  },
});
