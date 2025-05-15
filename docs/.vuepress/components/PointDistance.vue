<template>
  <ElRow v-for="(point, index) in points" :key="index" justify="center" align="middle">
    <ElCol :span="2">
      <EditableTag type="primary" v-model="point.name" :initialValue="index.toString()" />
    </ElCol>
    <ElCol :span="2">
      <ElText>经度：</ElText>
    </ElCol>
    <ElCol :span="5">
      <ElInputNumber v-model="point.lng" :controls="false" :min="0" :precision="4" />
    </ElCol>
    <ElCol :span="2">
      <ElText>纬度：</ElText>
    </ElCol>
    <ElCol :span="5">
      <ElInputNumber v-model="point.lat" :controls="false" :min="0" :precision="4" />
    </ElCol>
    <ElCol :span="2">
      <ElButton type="danger" :disabled="index < 2" @click="deletePoint(index)">删除</ElButton>
    </ElCol>
  </ElRow>
  <ElRow justify="space-around" align="middle">
    <ElCol :span="1">
      <ElButton type="primary" size="large" @click="appendPoint">添加坐标点</ElButton>
    </ElCol>
    <ElCol :span="1">
      <ElButton type="primary" size="large" @click="calculate">计算</ElButton>
    </ElCol>
  </ElRow>
  <ElDialog v-model="isDialogVisible">
    <ElTable :data="visibleDistanceList" :stripe="true" height="500">
      <ElTableColumn prop="from" label="起点">
        <template #header>
          <ElSelect v-model="selectedFromList" multiple placeholder="选择起点" collapse-tags collapse-tags-tooltip>
            <ElOption v-for="(item, index) in fromFilters" :key="index" :label="item" :value="item" />
          </ElSelect>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="to" label="终点">
        <template #header>
          <ElSelect v-model="selectedToList" multiple placeholder="选择终点" collapse-tags collapse-tags-tooltip>
            <ElOption v-for="(item, index) in toFilters" :key="index" :label="item" :value="item" />
          </ElSelect>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="distance" label="距离（米）" sortable />
    </ElTable>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElRow, ElCol, ElInputNumber, ElButton, ElDialog, ElText, ElTable, ElTableColumn, ElSelect, ElOption } from 'element-plus';
import { getPreciseDistance } from 'geolib';
import { EditableTag } from './core';

interface Point {
  name?: string;
  lat: number; // 纬度
  lng: number; // 经度
}

interface PointDistance {
  from: string;
  to: string;
  distance: number;
}

const selectedFromList = ref<Array<string>>([]);
const selectedToList = ref<Array<string>>([]);
const isDialogVisible = ref(false);
const points = ref<Array<Point>>([{ lat: 0, lng: 0 }, { lat: 0, lng: 0 }]);
const distanceList = computed(() => {
  const list: Array<PointDistance> = [];
  for (let i = 0; i < points.value.length; i++) {
    for (let j = i + 1; j < points.value.length; j++) {
      list.push({
        from: points.value[i].name || i.toString(),
        to: points.value[j].name || j.toString(),
        distance: getPreciseDistance(points.value[i], points.value[j]),
      });
    }
  }
  return list;
})
const visibleDistanceList = computed(() => {
  return distanceList.value.filter((item) => {
    return (selectedFromList.value.length === 0 || selectedFromList.value.includes(item.from)) &&
      (selectedToList.value.length === 0 || selectedToList.value.includes(item.to))
  })
})
const fromFilters = computed((): Array<string> => {
  const fromList: Array<string> = [];
  return distanceList.value.filter((item) => {
    if (fromList.includes(item.from)) {
      return false;
    }
    fromList.push(item.from);
    return true;
  }).map((item) => (item.from))
});
const toFilters = computed((): Array<string> => {
  const toList: Array<string> = [];
  return distanceList.value.filter((item) => {
    if (toList.includes(item.to)) {
      return false;
    }
    toList.push(item.to);
    return true;
  }).map((item) => (item.to))
});
const appendPoint = () => {
  points.value.push({
    lat: 0,
    lng: 0,
  })
}
const deletePoint = (index: number) => {
  points.value.splice(index, 1);
}
const calculate = () => {
  selectedFromList.value = [];
  selectedToList.value = [];
  isDialogVisible.value = true;
}
</script>

<style lang="css" scoped>
.el-row {
  margin-top: 20px;
}
</style>
