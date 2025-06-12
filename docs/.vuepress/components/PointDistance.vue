<template>
  <el-row v-for="(point, index) in points" :key="index" justify="center" align="middle">
    <el-col :span="2">
      <EditableTag type="primary" v-model="point.name" :initialValue="index.toString()" />
    </el-col>
    <el-col :span="2">
      <el-text>经度：</el-text>
    </el-col>
    <el-col :span="5">
      <el-input-number v-model="point.lng" :controls="false" :min="0" :precision="4" />
    </el-col>
    <el-col :span="2">
      <el-text>纬度：</el-text>
    </el-col>
    <el-col :span="5">
      <el-input-number v-model="point.lat" :controls="false" :min="0" :precision="4" />
    </el-col>
    <el-col :span="2">
      <el-button type="danger" :disabled="index < 2" @click="deletePoint(index)">删除</el-button>
    </el-col>
  </el-row>
  <el-row justify="space-around" align="middle">
    <el-col :span="1">
      <el-button type="primary" size="large" @click="appendPoint">添加坐标点</el-button>
    </el-col>
    <el-col :span="1">
      <el-button type="primary" size="large" @click="calculate">计算</el-button>
    </el-col>
  </el-row>
  <el-dialog v-model="isDialogVisible">
    <el-table :data="visibleDistanceList" :stripe="true" height="500">
      <el-table-column prop="from" label="起点">
        <template #header>
          <el-select v-model="selectedFromList" multiple placeholder="选择起点" collapse-tags collapse-tags-tooltip>
            <el-option v-for="(item, index) in fromFilters" :key="index" :label="item" :value="item" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="to" label="终点">
        <template #header>
          <el-select v-model="selectedToList" multiple placeholder="选择终点" collapse-tags collapse-tags-tooltip>
            <el-option v-for="(item, index) in toFilters" :key="index" :label="item" :value="item" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="distance" label="距离（米）" sortable />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
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
