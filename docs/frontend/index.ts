import { GroupConfig } from '@/types';
import axios from './axios';
import css from './css';
import dart from './dart';
import es6 from './es6';
import html from './html';
import i18next from './i18next';
import javascript from './javascript';
import koa from './koa';
import react from './react';
import typescript from './typescript';
import vue from './vue';

const config: GroupConfig = {
  text: '前端',
  icon: 'devicon-plain:devicon',
  children: [axios, css, dart, es6, html, javascript, vue, typescript, react, i18next, koa],
  dir: __dirname,
};

export default config;
