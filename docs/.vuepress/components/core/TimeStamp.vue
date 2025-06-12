<template>
  <el-input v-model="inputText" :readonly="readonly" size="large">
    <template #append v-if="!disableUnit">
      <el-select v-model="unit" size="large">
        <el-option label="秒" value="s" />
        <el-option label="毫秒" value="ms" />
      </el-select>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { formatTimestamp, formatDate } from '../utils';
type unitType = 'ms' | 's';
const props = withDefaults(defineProps<{
  value?: Date | number;
  disableUnit?: boolean;
}>(), {
  disableUnit: false,
  value: 0,
})
const unit = ref<unitType>('s');
const inputText = ref(formatTimestamp(props.value, unit.value));
watch(() => props.value, () => {
  inputText.value = formatTimestamp(props.value, unit.value);
});
const readonly = computed(() => (props.value instanceof Date));
const emit = defineEmits<{
  (event: 'change', value: Date): void;
}>()
watch([inputText, unit], ([newInputText, newUnit]) => {
  if (props.value instanceof Date) {
    return;
  }
  emit('change', formatDate(newInputText, newUnit));
});
</script>

<style scoped>
.el-select {
  width: 80px;
}
</style>
