<template>
  <el-row justify="space-between">
    <el-col :span="10">
      <el-input v-model="input" type="textarea" :rows="rows" />
    </el-col>
    <el-col :span="13">
      <el-row>
        <el-col>
          <el-card>
            <template #header>
              <el-text type="primary">Header</el-text>
            </template>
            <JsonEditor
              :mode="Mode.text"
              v-model="result.header"
              :main-menu-bar="false"
              :navigation-bar="false"
              :ask-to-format="false"
              read-only
            />
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-divider />
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-card>
            <template #header>
              <el-text type="primary">Payload</el-text>
            </template>
            <JsonEditor
              :mode="Mode.text"
              v-model="result.payload"
              :main-menu-bar="false"
              :navigation-bar="false"
              :ask-to-format="false"
              read-only
            />
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { Base64 } from 'js-base64';
import { Mode } from 'vanilla-jsoneditor';
import JsonEditor from 'json-editor-vue';
import { errorTip } from './utils';
const input = ref('');
const result = reactive<{
  header?: any;
  payload?: any;
  signature?: string;
}>({});
const rows = 30;
watch(input, () => {
  const parts = input.value.split('.');
  if (parts.length !== 3) {
    return;
  }
  try {
    result.header = JSON.parse(Base64.decode(parts[0]));
    result.payload = JSON.parse(Base64.decode(parts[1]));
    result.signature = parts[2];
  } catch (error) {
    errorTip('Invalid input');
  }
});
</script>
