import { GroupConfig } from '@doc-types';
import git from './git';
import cleanCode from './clean-code';
import codingStyle from './coding-style';
import restful from './restful';
import designPattern from './design-pattern';
import markdown from './markdown';
import openwrt from './openwrt';
import regex from './regex';
import ubuntuInit from './ubuntu-init';
import vscode from './vscode';
import wsl from './wsl';
import tools from './tools';

const config: GroupConfig = {
  text: 'others',
  icon: 'material-icon-theme:folder-other',
  children: [
    git,
    regex,
    cleanCode,
    codingStyle,
    restful,
    designPattern,
    markdown,
    openwrt,
    ubuntuInit,
    vscode,
    wsl,
    tools,
  ],
  dir: __dirname,
};

export default config;
