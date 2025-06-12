<template>
  <el-tabs v-model="tab" @tab-change="refresh">
    <el-tab-pane label="随机 ObjectId" name="random">
      <el-result>
        <template #icon>
          <el-text type="primary" size="large">{{ randomId.toHexString() }}</el-text>
        </template>
        <template #sub-title class="buttons">
          <el-space size="large">
            <el-button type="primary" size="large" @click="copyToClipboard(randomId.toHexString())">复制</el-button>
            <el-divider direction="vertical"/>
            <el-button size="large" @click="refresh">刷新</el-button>
          </el-space>
        </template>
      </el-result>
    </el-tab-pane>

    <el-tab-pane label="ObjectId 时间转换" name="time">
      <el-form inline label-position="top" size="large" class="form-inline">
        <el-form-item label="ObjectId">
          <el-input v-model="inputId" clearable />
        </el-form-item>
        <el-form-item label="对应时间">
          <el-input :value="getTime(inputId)" readonly />
        </el-form-item>
      </el-form>

      <el-form inline label-position="top" size="large" class="form-inline">
        <el-form-item label="时间">
          <el-date-picker v-model="inputTime" type="datetime" />
        </el-form-item>
        <el-form-item label="对应 ObjectId">
          <el-input :value="objectIdFromTime(inputTime)" readonly />
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ObjectID } from 'bson';
import { ref } from 'vue';
import { copyToClipboard } from './utils';
type tab = 'random' | 'time';
const randomId = ref(new ObjectID());
const inputId = ref('');
const inputTime = ref<Date>(new Date());
const tab = ref<tab>('random');
const refresh = () => {
  randomId.value = new ObjectID();
};
const getTime = (id: string | ObjectID): string => {
  if (id instanceof ObjectID) {
    return id.getTimestamp().toISOString();
  }
  if (ObjectID.isValid(id)) {
    return ObjectID.createFromHexString(id).getTimestamp().toISOString()
  }
  return '';
}
const objectIdFromTime = (time: Date): string => {
  if (!time) {
    return '';
  }
  return ObjectID.createFromTime(time.getTime() / 1000).toHexString();
}
</script>

<style scoped>
.form-inline {
  justify-content: space-around;
  margin-top: 30px;
}
.form-inline .el-input {
  --el-input-width: 250px;
  --el-date-editor-width: 250px;
}
.el-result__subtitle {
  margin-top: 50px;
}
</style>
