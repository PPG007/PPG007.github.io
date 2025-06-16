import 'element-plus/theme-chalk/dark/css-vars.css';
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';
import { defineClientConfig } from 'vuepress/client';
import { useDarkMode } from 'vuepress-theme-hope/client';
import { onMounted, watch } from 'vue';
import { useThemeColor, useIframeUrl, useIframeReady } from './scripts';
import { Layout } from './components';

const setElementUIDark = (dark: boolean) => {
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export default defineClientConfig({
  setup() {
    let changeThemeFn = (color?: string): void => {};
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
      const iframeReady = useIframeReady();
      changeThemeFn = changeTheme;
      changeThemeFn(color.value);
      setElementUIDark(isDarkMode.value);
      window.addEventListener('message', (event) => {
        if (event.data === 'ready') {
          iframeReady.value = true;
        }
      });
    });
  },
  layouts: {
    Layout,
  },
  enhance({ router }) {
    const url = useIframeUrl();
    router.beforeEach((to, _, next) => {
      if (to.fullPath.startsWith('/iframe/')) {
        next();
        return;
      }
      url.value = '';
      if (to.fullPath.startsWith('/kb-')) {
        url.value = to.fullPath;
        return next(`/iframe/?iframe=${to.fullPath}`);
      }
      next();
    });
  },
});
