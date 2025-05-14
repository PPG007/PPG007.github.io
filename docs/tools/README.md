# 在线工具

## UUID

<UUID />

## ObjectId

<ObjectId />

## 时间相关

<Time />

## Base64

<Base64 />

## URL encode/decode

<URL />

## 个税计算

<Tax />

<script setup>
import { ObjectId, UUID, Time, Base64, URL, Tax } from '@components';
import { useDarkMode } from 'vuepress-theme-hope/client';
import { watch } from 'vue';

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
