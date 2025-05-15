import 'element-plus/theme-chalk/dark/css-vars.css';
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';
import { defineClientConfig } from 'vuepress/client';
import { useDarkMode } from 'vuepress-theme-hope/client';
import { watch } from 'vue';

export default defineClientConfig({
  setup() {
    const { isDarkMode } = useDarkMode();
    watch(
      isDarkMode,
      () => {
        if (isDarkMode.value) {
          document.querySelector('html')?.classList.add('dark');
        } else {
          document.querySelector('html')?.classList.remove('dark');
        }
      },
      { immediate: true }
    );
  },
});
