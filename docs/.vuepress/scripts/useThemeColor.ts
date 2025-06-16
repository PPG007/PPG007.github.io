import { ref, onMounted } from 'vue';
import { colors } from '../styles';
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

export default function useThemeColor() {
  const color = ref<string>('');
  onMounted(() => {
    const htmlElement = document.documentElement;
    color.value = getColor(Array.from(htmlElement.classList));
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          color.value = getColor(Array.from(htmlElement.classList));
        }
      }
    });
    observer.observe(htmlElement, {
      attributes: true,
    });
    return observer;
  });
  return color;
}
