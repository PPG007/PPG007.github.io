<template>
  <el-tooltip v-if="!inputVisible" content="双击编辑">
    <el-tag @dblclick="onEdit">{{ value }}</el-tag>
  </el-tooltip>
  <el-input v-else v-model="value" @blur="onInputConfirm" @keyup.enter="onInputConfirm" size="small"
    class="tag-editor" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
