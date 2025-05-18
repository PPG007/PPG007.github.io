import { ref, onMounted } from 'vue';

export default function useHtmlClassWatcher() {
  const htmlClasses = ref<string[]>([]);
  onMounted(() => {
    const htmlElement = document.documentElement;
    htmlClasses.value = Array.from(htmlElement.classList);
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          htmlClasses.value = Array.from(htmlElement.classList); // 每次赋新数组
        }
      }
    });
    observer.observe(htmlElement, {
      attributes: true,
    });
    return observer;
  });

  return htmlClasses;
}
