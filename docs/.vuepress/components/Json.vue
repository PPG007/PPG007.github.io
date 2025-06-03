<template>
  <ElTabs type="card" @edit="onTabsEdited" editable v-model="tab">
    <ElTabPane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
      <JsonEditor :class="className" />
    </ElTabPane>
  </ElTabs>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import JsonEditor from 'json-editor-vue';
import { useDarkMode } from 'vuepress-theme-hope/client';
import { ElTabs, ElTabPane } from 'element-plus';

const tab = ref<number>(1);
const tabs = ref([{
  name: 1,
  label: '1',
}])
const { isDarkMode } = useDarkMode();

const className = ref('');

watch(isDarkMode, (isDark) => {
  className.value = isDark ? 'jse-theme-dark' : '';
}, { immediate: true })

const onTabsEdited = (name: string | number | undefined, action: 'add' | 'remove') => {
  if (action === 'remove' && name) {
    tabs.value = tabs.value.filter((tab) => tab.name !== name);
    return;
  }
  if (action === 'add') {
    tabs.value.push({
      name: tabs.value.length + 1,
      label: (tabs.value.length + 1).toString(),
    });
  }
}
</script>
