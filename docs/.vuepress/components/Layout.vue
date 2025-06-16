<template>
  <Layout v-if="url">
    <template #default>
      <iframe class="iframe" :src="formattedUrl" frameborder="0"></iframe>
    </template>
  </Layout>
  <Layout v-else/>
</template>

<script setup lang="ts">
import { Layout } from 'vuepress-theme-hope/client';
import { useIframeUrl } from '../scripts';
import { computed } from 'vue';
import { hostname } from '../consts';

const url = useIframeUrl();
const formattedUrl = computed(() => {
  return `${hostname}${url.value}`;
})
</script>

<style lang="css" scoped>
.iframe {
  height: calc(100vh - 3.75rem);
  width: 100%;
  margin-top: 3.75rem;
}
</style>
