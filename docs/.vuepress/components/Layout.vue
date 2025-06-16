<template>
  <Layout v-if="url">
    <template #default>
      <iframe class="iframe" :src="formattedUrl" frameborder="0" v-show="iframeReady"
        v-loading.fullscreen="!iframeReady" ref="iframe"></iframe>
    </template>
  </Layout>
  <Layout v-else />
</template>

<script setup lang="ts">
import { Layout } from 'vuepress-theme-hope/client';
import { useIframeUrl, useIframeReady, useThemeColor } from '../scripts';
import { computed, watch, useTemplateRef, onMounted } from 'vue';
import { useRoute } from 'vuepress/client';
import { hostname } from '../consts';

const iframe = useTemplateRef('iframe');
const color = useThemeColor();
const iframeReady = useIframeReady();
const url = useIframeUrl();
const formattedUrl = computed(() => {
  return `${hostname}${url.value}`;
});
const sendColorUpdatedEvent = (color: string) => {
  iframe.value?.contentWindow?.postMessage({
    type: 'themeColorUpdated',
    value: color,
  });
}
watch(url, () => {
  iframeReady.value = false;
});
watch(iframeReady, (newVal) => {
  if (newVal) {
    sendColorUpdatedEvent(color.value)
  }
});
watch(color, (newVal) => {
  sendColorUpdatedEvent(newVal);
}, { immediate: true });
onMounted(() => {
  if (url.value) {
    return;
  }
  const { query: { iframe } } = useRoute();
  if (iframe && typeof iframe === 'string') {
    url.value = iframe;
  }
})
</script>

<style lang="css" scoped>
.iframe {
  height: calc(100vh - 3.75rem);
  width: 100%;
  margin-top: 3.75rem;
}
</style>
