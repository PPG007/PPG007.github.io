<template>
  <el-result>
    <template #icon>
      <el-text type="primary" size="large">{{ id }}</el-text>
    </template>
    <template #title>
      <el-button type="primary" size="large" @click="copyToClipboard(id)">复制</el-button>
    </template>
    <template #sub-title>
      <el-space size="large">
        <el-button @click="genV1" size="large">生成 UUID V1</el-button>
        <el-divider direction="vertical" />
        <el-button @click="genV4" size="large">生成 UUID V4</el-button>
      </el-space>
    </template>
  </el-result>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { v1, v4 } from 'uuid';
import { copyToClipboard } from './utils';
const id = ref(v4());
const genV1 = () => {
  id.value = v1();
};
const genV4 = () => {
  id.value = v4();
};
</script>
