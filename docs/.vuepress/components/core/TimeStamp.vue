<template>
  <el-input v-model="inputText" :readonly="readonly" size="large">
    <template #append v-if="!disableUnit">
      <el-select v-model="unit" size="large">
        <el-option label="秒" value="s" />
        <el-option label="毫秒" value="ms" />
        <el-option v-if="readonly" label="ISO8601" value="iso" />
      </el-select>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { formatTimestamp, formatDate } from '../utils';
import { TimeUnit } from '../types';
const props = withDefaults(
  defineProps<{
    value?: Date | number;
    disableUnit?: boolean;
  }>(),
  {
    disableUnit: false,
    value: 0,
  }
);
const unit = ref<TimeUnit>('s');
const inputText = ref(formatTimestamp(props.value, unit.value));
watch(
  () => props.value,
  () => {
    inputText.value = formatTimestamp(props.value, unit.value);
  }
);
const readonly = computed(() => props.value instanceof Date);
const emit = defineEmits<{
  (event: 'change', value: Date): void;
}>();
watch([inputText, unit], ([newInputText, newUnit]) => {
  if (props.value instanceof Date) {
    inputText.value = formatTimestamp(props.value, newUnit);
    return;
  }
  // try convert to number
  const num = Number(newInputText);
  if (isNaN(num)) {
    return;
  }
  emit('change', formatDate(num, newUnit));
});
</script>

<style scoped>
.el-select {
  width: 110px;
}
</style>
