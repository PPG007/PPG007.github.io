<template>
  <Blog>
    <template #heroBg>
      <BingHeroBackground />
    </template>
    <template #heroInfo="data">
      <el-button size="large" type="primary" @click="onClickTools">
        <template #icon>
          <VPIcon icon="fa-solid:tools" />
        </template>
        在线工具
      </el-button>
      <HitokotoBlogHero v-bind="{ ...data, text: data.text ?? '' }" />
    </template>
  </Blog>
</template>

<script setup lang="ts">
import { Blog } from 'vuepress-theme-hope/blog';
import BingHeroBackground from 'vuepress-theme-hope/presets/BingHeroBackground.js';
import HitokotoBlogHero from 'vuepress-theme-hope/presets/HitokotoBlogHero.js';
import { useRouter } from 'vuepress/client';

const router = useRouter();
const onClickTools = () => {
  router.push('/tools/docs/');
};
</script>
