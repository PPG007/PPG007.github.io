<template>
  <ElTabs v-model="tab" @tab-change="refresh">
    <ElTabPane label="随机 ObjectId" name="random">
      <ElResult>
        <template #icon>
          <ElText type="primary" size="large">{{ randomId.toHexString() }}</ElText>
        </template>
        <template #sub-title class="buttons">
          <ElSpace size="large">
            <ElButton type="success" size="large" @click="copyToClipboard(randomId.toHexString())">复制</ElButton>
            <ElDivider direction="vertical"/>
            <ElButton size="large" @click="refresh">刷新</ElButton>
          </ElSpace>
        </template>
      </ElResult>
    </ElTabPane>

    <ElTabPane label="ObjectId 时间转换" name="time">
      <ElForm inline label-position="top" size="large" class="form-inline">
        <ElFormItem label="ObjectId">
          <ElInput v-model="inputId" clearable />
        </ElFormItem>
        <ElFormItem label="对应时间">
          <ElInput :value="getTime(inputId)" readonly />
        </ElFormItem>
      </ElForm>

      <ElForm inline label-position="top" size="large" class="form-inline">
        <ElFormItem label="时间">
          <ElDatePicker v-model="inputTime" type="datetime" />
        </ElFormItem>
        <ElFormItem label="对应 ObjectId">
          <ElInput :value="objectIdFromTime(inputTime)" readonly />
        </ElFormItem>
      </ElForm>
    </ElTabPane>
  </ElTabs>
</template>

<script setup lang="ts">
import { ObjectID } from 'bson';
import { ElButton, ElTabs, ElTabPane, ElResult, ElText, ElForm, ElFormItem, ElInput, ElDatePicker, ElDivider, ElSpace } from 'element-plus';
import { ref } from 'vue';
import { copyToClipboard } from '../utils';
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
