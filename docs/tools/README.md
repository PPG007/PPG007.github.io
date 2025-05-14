# 在线工具

## UUID

<UUID />

## ObjectId

<ObjectId />

## 时间相关

<Time />

<script setup>
import { ObjectId, UUID, Time } from '@components';
import { useDarkMode } from 'vuepress-theme-hope/client';
import { watch } from 'vue';
import 'element-plus/theme-chalk/dark/css-vars.css';
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
</script>
