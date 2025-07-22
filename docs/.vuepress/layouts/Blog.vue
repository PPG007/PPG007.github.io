<template>
  <Blog>
    <template #heroBg>
      <BingHeroBackground />
    </template>
    <template #heroInfo="data">
      <HitokotoBlogHero v-bind="{ ...data, text: data.text ?? '' }" />
    </template>
  </Blog>
</template>

<script setup lang="ts">
import { Blog } from 'vuepress-theme-hope/blog';
import BingHeroBackground from 'vuepress-theme-hope/presets/BingHeroBackground.js';
import HitokotoBlogHero from 'vuepress-theme-hope/presets/HitokotoBlogHero.js';
</script>
