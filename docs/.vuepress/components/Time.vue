<template>
  <ElRow justify="center">
    <ElCol :span="5">
      <p>当前时间戳</p>
    </ElCol>
    <ElCol :span="8">
      <TimeStamp :value="now" disableUnit />
    </ElCol>
  </ElRow>
  <ElRow justify="space-around">
    <ElCol :span="8">
      <ElDatePicker v-model="selectDate" type="datetime" size="large"/>
    </ElCol>
    <ElCol :span="8">
      <TimeStamp :value="selectDate" />
    </ElCol>
  </ElRow>
  <ElRow justify="space-around">
    <ElCol :span="8">
      <TimeStamp @change="onInputChanged" />
    </ElCol>
    <ElCol :span="8">
      <ElInput readonly :value="inputDateStr" size="large"/>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElInput, ElDatePicker, ElRow, ElCol } from 'element-plus';
import TimeStamp from './TimeStamp.vue';
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
