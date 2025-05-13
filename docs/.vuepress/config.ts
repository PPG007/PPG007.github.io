import viteBundler from '@vuepress/bundler-vite';
import { defaultTheme } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';
import { init } from './scripts';

const { navbar, sidebar } = await init();

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'PPG007 的文档',
  description: 'PPG007 的站点',
  public: 'docs/images',
  theme: defaultTheme({
    navbar,
    sidebar,
  }),
  bundler: viteBundler(),
});
