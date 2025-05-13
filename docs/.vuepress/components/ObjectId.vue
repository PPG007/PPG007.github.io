<template>
  <template v-if="tab === 'random'">
    <p>{{ id.toHexString() }}</p>
    <button @click="refresh">刷新</button>
  </template>
  <template v-else>
    <input v-model="id" />
    <p>{{ time }}</p>
  </template>
</template>

<script setup lang="ts">
import { ObjectID } from 'bson';
import { computed, ref } from 'vue';
type tab = 'random' | 'time';
withDefaults(defineProps<{ tab?: tab }>(), {
  tab: 'random',
})
const id = ref(new ObjectID());

const time = computed(() => {
  return id.value.getTimestamp().toISOString();
});
const refresh = () => {
  id.value = new ObjectID();
};
</script>
