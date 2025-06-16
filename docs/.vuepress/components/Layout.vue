<template>
  <Layout v-if="url">
    <template #default>
      <iframe class="iframe" :src="formattedUrl" frameborder="0" v-show="iframeReady" v-loading.fullscreen="!iframeReady"></iframe>
    </template>
  </Layout>
  <Layout v-else/>
</template>

<script setup lang="ts">
import { Layout } from 'vuepress-theme-hope/client';
import { useIframeUrl, useIframeReady } from '../scripts';
import { computed, watch } from 'vue';
import { hostname } from '../consts';

const iframeReady = useIframeReady();
const url = useIframeUrl();
const formattedUrl = computed(() => {
  return `${hostname}${url.value}`;
})
watch(url, () => {
  iframeReady.value = false;
});
</script>

<style lang="css" scoped>
.iframe {
  height: calc(100vh - 3.75rem);
  width: 100%;
  margin-top: 3.75rem;
}
</style>
