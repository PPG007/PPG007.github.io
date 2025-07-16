<template>
  <el-tabs type="card" @edit="onTabsEdited" editable v-model="tab">
    <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
      <el-card shadow="never">
        <template #header>
          <el-row justify="space-evenly">
            <el-col :span="4">
              <el-button type="primary" :disabled="!isButtonEnabled" @click="onEscape">转义</el-button>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" :disabled="!isButtonEnabled" @click="onUnescape">去除转义</el-button>
            </el-col>
          </el-row>
        </template>
        <JsonEditor :class="className" v-model:mode="tab.mode" v-model="tab.value" />
      </el-card>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import JsonEditor from 'json-editor-vue';
import { Mode } from 'vanilla-jsoneditor';
import { useDarkMode } from '../scripts';

const tab = ref<number>(1);
const tabs = ref([
  {
    name: 1,
    label: '1',
    value: '',
    mode: Mode.text,
  },
]);
const isDarkMode = useDarkMode();
const className = ref('');
const isButtonEnabled = computed(() => {
  const currentTab = tabs.value.find((t) => t.name === tab.value);
  return currentTab?.value !== '' && currentTab?.mode === Mode.text;
});

watch(
  isDarkMode,
  (isDark) => {
    className.value = isDark ? 'jse-theme-dark' : '';
  },
  { immediate: true }
);

const onTabsEdited = (name: string | number | undefined, action: 'add' | 'remove') => {
  if (action === 'remove' && name) {
    tabs.value = tabs.value.filter((tab) => tab.name !== name);
    tab.value = tabs.value.length;
    return;
  }
  if (action === 'add') {
    tabs.value.push({
      name: tabs.value.length + 1,
      label: (tabs.value.length + 1).toString(),
      value: '',
      mode: Mode.text,
    });
    tab.value = tabs.value.length;
  }
};

const onEscape = () => {
  const currentTab = tabs.value.find((t) => t.name === tab.value);
  if (currentTab) {
    currentTab.value = currentTab.value.replaceAll('\n', '');
    currentTab.value = currentTab.value.replaceAll('\t', '');
    currentTab.value = currentTab.value.replaceAll(' ', '');
    currentTab.value = currentTab.value.replaceAll('\\', '\\\\');
    currentTab.value = currentTab.value.replaceAll('"', '\\"');
  }
};

const onUnescape = () => {
  const currentTab = tabs.value.find((t) => t.name === tab.value);
  if (currentTab) {
    currentTab.value = currentTab.value.replaceAll('\n', '\\n');
    currentTab.value = currentTab.value.replaceAll('\t', '\\t');
    currentTab.value = currentTab.value.replaceAll(' ', '\\ ');
    currentTab.value = currentTab.value.replaceAll('\\\\', '\\');
    currentTab.value = currentTab.value.replaceAll('\\"', '"');
  }
};
</script>
