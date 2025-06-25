import { ref, onMounted } from 'vue';

export default function useDarkMode() {
    const isDarkMode = ref<boolean>(false);
    onMounted(() => {
        const htmlElement = document.documentElement;
        isDarkMode.value = htmlElement.getAttribute('data-theme') === 'dark';
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    isDarkMode.value = htmlElement.getAttribute('data-theme') === 'dark';
                }
            }
        });
        observer.observe(htmlElement, {
            attributes: true,
        });
        return observer;
    });
    return isDarkMode;
}
