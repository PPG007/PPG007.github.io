<template>
  <JsonEditor
    :class="className"
    v-model:mode="mode"
    v-model="value"
    :main-menu-bar="mainMenuBar"
    :navigation-bar="navigationBar"
    :ask-to-format="askToFormat"
    :read-only="readOnly"
  />
</template>

<script setup lang="ts">
import JsonEditor from 'json-editor-vue';
import { ref, watch } from 'vue';
import { useDarkMode } from '../../scripts';
import { Mode } from 'vanilla-jsoneditor';

const mode = defineModel<Mode>('mode');
const value = defineModel<any>();

const {
  mainMenuBar = true,
  navigationBar = true,
  askToFormat = true,
  readOnly = false,
} = defineProps<{
  mainMenuBar?: boolean;
  navigationBar?: boolean;
  askToFormat?: boolean;
  readOnly?: boolean;
}>();
const isDarkMode = useDarkMode();
const className = ref('');
watch(
  isDarkMode,
  (isDark) => {
    className.value = isDark ? 'jse-theme-dark' : '';
  },
  { immediate: true }
);
</script>
