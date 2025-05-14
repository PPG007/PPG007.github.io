<template>
  <ElRow justify="space-around" align="middle">
    <ElCol :span="9">
      <ElInput v-model="input" type="textarea" :rows="rows" placeholder="请输入内容"/>
    </ElCol>
    <ElCol :span="6">
      <div class="buttons">
        <ElButton type="primary" @click="encode" size="large">编码</ElButton>
        <ElButton type="primary" @click="decode" size="large" plain>解码</ElButton>
      </div>
    </ElCol>
    <ElCol :span="9">
      <ElInput :value="result" readonly type="textarea" :rows="rows"/>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
import { ElInput, ElRow, ElCol, ElButton } from 'element-plus';
import { ref } from 'vue';
import { Base64 } from 'js-base64';
const input = ref('');
const result = ref('');
const rows = 20;
const encode = () => {
  result.value = Base64.encode(input.value);
}
const decode = () => {
  result.value = Base64.decode(input.value);
}
</script>

<style lang="css" scoped>
.buttons{
  display: flex;
  justify-content: space-around;
}
</style>
