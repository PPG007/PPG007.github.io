<template>
  <ElTooltip v-if="!inputVisible" content="双击编辑">
    <ElTag @dblclick="onEdit">{{ value }}</ElTag>
  </ElTooltip>
  <ElInput v-else v-model="value" @blur="onInputConfirm" @keyup.enter="onInputConfirm" size="small"
    class="tag-editor" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElTag, ElInput, ElTooltip } from 'element-plus';
const value = defineModel({ type: String });
const props = defineProps<{ initialValue?: string }>();
const inputVisible = ref(false);
const onInputConfirm = () => {
  inputVisible.value = false;
}
const onEdit = () => {
  inputVisible.value = true;
}
onMounted(() => {
  if (!value.value && props.initialValue) {
    value.value = props.initialValue;
  }
})
</script>

<style scoped lang="css">
.tag-editor {
  width: 40px;
}
</style>
