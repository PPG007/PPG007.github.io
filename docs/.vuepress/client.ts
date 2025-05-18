import 'element-plus/theme-chalk/dark/css-vars.css';
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';
import { defineClientConfig } from 'vuepress/client';
import { useDarkMode } from 'vuepress-theme-hope/client';
import { onMounted, watch, ref } from 'vue';
import { useHtmlClassWatcher } from './scripts';
import { colors } from './styles';

const setElementUIDark = (dark: boolean) => {
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const getColor = (classList: Array<string>): string => {
  let index = 0;
  classList.forEach((className) => {
    if (className.startsWith('theme-')) {
      const temp = parseInt(className.replace(/^theme-/, ''));
      if (!isNaN(temp)) {
        index = temp - 1;
      }
    }
  });
  if (index >= 0 && index < colors.length) {
    return colors[index];
  }
  return colors[0];
}

export default defineClientConfig({
  setup() {
    let changeThemeFn = (color?: string): void => {}
    const { isDarkMode } = useDarkMode();
    const htmlClassList = useHtmlClassWatcher();
    watch(isDarkMode, () => {
      setElementUIDark(isDarkMode.value);
    });
    watch(htmlClassList, (newVal) => {
      changeThemeFn(getColor(newVal));
    })
    onMounted(async () => {
      const { useElementPlusTheme } = await import('use-element-plus-theme');
      const { changeTheme } = useElementPlusTheme();
      changeThemeFn = changeTheme;
      changeThemeFn(getColor(htmlClassList.value));
      setElementUIDark(isDarkMode.value);
    });
  },
});
