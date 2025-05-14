<template>
  <ElInput v-model="inputText" :readonly="readonly" size="large">
    <template #append v-if="!disableUnit">
      <ElSelect v-model="unit" size="large">
        <ElOption label="秒" value="s" />
        <ElOption label="毫秒" value="ms" />
      </ElSelect>
    </template>
  </ElInput>
</template>

<script setup lang="ts">
import { ref, computed, defineExpose, watch } from 'vue';
import { ElInput, ElSelect, ElOption } from 'element-plus';
import { formatTimestamp, formatDate } from '../../utils';
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
