<template>
  <p>{{ id }}</p>
  <button @click="genV1">generate v1</button>
  <button @click="genV4">generate v4</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { v1, v4 } from 'uuid';
const id = ref(v4());
const genV1 = () => {
  id.value = v1();
};
const genV4 = () => {
  id.value = v4();
};
</script>
