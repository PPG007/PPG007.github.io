<template>
  <ElResult>
    <template #icon>
      <ElText type="primary" size="large">{{ id }}</ElText>
    </template>
    <template #title>
      <ElButton type="success" size="large" @click="copyToClipboard(id)">复制</ElButton>
    </template>
    <template #sub-title>
      <ElSpace size="large">
        <ElButton @click="genV1" size="large">生成 UUID V1</ElButton>
        <ElDivider direction="vertical" />
        <ElButton @click="genV4" size="large">生成 UUID V4</ElButton>
      </ElSpace>
    </template>
  </ElResult>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { v1, v4 } from 'uuid';
import { copyToClipboard } from '../utils';
import { ElButton, ElResult, ElText, ElSpace, ElDivider } from 'element-plus';
const id = ref(v4());
const genV1 = () => {
  id.value = v1();
};
const genV4 = () => {
  id.value = v4();
};
</script>
