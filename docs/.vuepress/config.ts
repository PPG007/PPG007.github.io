import viteBundler from '@vuepress/bundler-vite';
import { defineUserConfig } from 'vuepress';
import { getDirname, path } from 'vuepress/utils';
import { init } from './scripts';
import { hopeTheme } from 'vuepress-theme-hope';
import ElementPlus from 'unplugin-element-plus/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

const { navbar, sidebar } = await init();
const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'PPG007 的文档',
  description: 'PPG007 的站点',
  theme: hopeTheme({
    navbar,
    sidebar,
    hostname: 'https://ppg007.github.io',
    docsDir: 'docs',
    docsRepo: 'https://github.com/PPG007/PPG007.github.io',
    docsBranch: 'main',
    markdown: {
      highlighter: {
        type: 'shiki',
        themes: {
          dark: 'one-dark-pro',
          light: 'light-plus',
        },
        whitespace: 'all',
      },
      codeTabs: true,
    },
    plugins: {
      watermark: {
        watermarkOptions: {
          content: 'PPG007',
        },
      },
      slimsearch: {
        suggestion: true,
        hotKeys: [{ key: 's', ctrl: true }],
      },
      copyright: true,
      git: true,
      comment: {
        provider: 'Giscus',
        repo: 'PPG007/PPG007.github.io',
        repoId: 'R_kgDOGk5u3g',
        category: 'General',
        categoryId: 'DIC_kwDOGk5u3s4COgEc',
      },
    },
  }),
  bundler: viteBundler({
    viteOptions: {
      plugins: [
        ElementPlus({}),
        AutoImport({
          resolvers: [ElementPlusResolver()],
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ],
      ssr: {
        noExternal: ['element-plus'],
      },
    },
  }),
  alias: {
    '@components': path.resolve(__dirname, 'components'),
  },
});
