<template>
  <JsonEditor v-model="model" :class="className" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import JsonEditor from 'json-editor-vue';
import { useDarkMode } from 'vuepress-theme-hope/client';

const model = ref<any>();
const { isDarkMode } = useDarkMode();
const className = computed(() => {
  return isDarkMode.value ? 'jse-theme-dark' : '';
});
</script>
