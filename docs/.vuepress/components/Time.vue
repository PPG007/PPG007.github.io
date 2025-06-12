<template>
  <el-row justify="center">
    <el-col :span="5">
      <p>当前时间戳</p>
    </el-col>
    <el-col :span="8">
      <TimeStamp :value="now" disableUnit />
    </el-col>
  </el-row>
  <el-row justify="space-around">
    <el-col :span="8">
      <el-date-picker v-model="selectDate" type="datetime" size="large" />
    </el-col>
    <el-col :span="8">
      <TimeStamp :value="selectDate" />
    </el-col>
  </el-row>
  <el-row justify="space-around">
    <el-col :span="8">
      <TimeStamp @change="onInputChanged" />
    </el-col>
    <el-col :span="8">
      <el-input readonly :value="inputDateStr" size="large" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { TimeStamp } from './core';
const now = ref(new Date());
const selectDate = ref<Date>(new Date());
const inputDateStr = ref<string>();
onMounted(() => {
  now.value = new Date;
  setInterval(() => {
    now.value = new Date;
  }, 1000);
})
const onInputChanged = (value: Date) => {
  inputDateStr.value = value.toISOString();
}
</script>

<style scoped>
.el-row {
  margin-bottom: 50px;
}
</style>
