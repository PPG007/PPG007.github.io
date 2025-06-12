<template>
  <el-row justify="space-around" align="middle">
    <el-col :span="9">
      <el-input v-model="input" type="textarea" :rows="rows" placeholder="请输入内容"/>
    </el-col>
    <el-col :span="6">
      <div class="buttons">
        <el-button type="primary" @click="encode" size="large">编码</el-button>
        <el-button type="primary" @click="decode" size="large" plain>解码</el-button>
      </div>
    </el-col>
    <el-col :span="9">
      <el-input :value="result" readonly type="textarea" :rows="rows"/>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
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
