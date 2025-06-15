import {
  NavbarOptions,
  NavbarGroupOptions,
  NavbarLinkOptions,
  SidebarOptions,
  SidebarObjectOptions,
  AutoLinkOptions,
} from 'vuepress-theme-hope';
import { BarConfig } from '../types';
import fs from 'fs';
import path from 'path';
import navbarList from './navbarList';

const configPath = 'docs/.vuepress/config';

const defaultNavbar: Array<NavbarGroupOptions> = [
  { text: '首页', link: '/', icon: 'material-symbols:home', children: [] },
];

const formatLink = (link: string): string => {
  if (link.endsWith('/')) {
    return link;
  }
  return `${link}/`;
};

const convertSingleNavBar = (item: NavbarGroupOptions): NavbarLinkOptions => {
  const result: NavbarLinkOptions = {
    text: item.text,
    link: item.link || '/',
    icon: item.icon,
  };
  if (item.children.length && typeof item.children[0].link === 'string') {
    result.link = item.children[0].link;
  }
  return result;
};

// 根据各个子配置生成总的 sidebar 配置对象
const loadSidebar = (configs: Array<BarConfig>): SidebarOptions => {
  const sidebar: SidebarObjectOptions = {};
  configs.forEach(({ sidebar: config }) => {
    Object.keys(config).forEach((key) => {
      sidebar[key] = config[key];
    });
  });
  return sidebar;
};

// 根据各个子配置生成总的 navbar 配置对象
const loadNavbar = (navbar: Array<NavbarGroupOptions>, configs: Array<BarConfig>): NavbarOptions => {
  const uniqueMap: {
    [key: string]: NavbarGroupOptions;
  } = {};
  configs.forEach((config) => {
    const {
      navbar: { group, text, link, icon },
    } = config;
    const child: NavbarLinkOptions = {
      text: text,
      link: formatLink(link),
      icon: icon,
    };
    if (!Object.keys(uniqueMap).includes(group)) {
      uniqueMap[group] = {
        text: group,
        children: [child],
      };
    } else {
      const currentChildren = uniqueMap[group].children;
      currentChildren.push(child);
      uniqueMap[group].children = currentChildren;
    }
  });
  Object.keys(uniqueMap).forEach((group) => {
    const order = navbarList.find((item) => item.text === group)?.childrenOrder || [];
    uniqueMap[group].children.sort((a, b) => {
      const orderA = order.indexOf((a as AutoLinkOptions).text) + 1 || Infinity;
      const orderB = order.indexOf((b as AutoLinkOptions).text) + 1 || Infinity;
      return orderA - orderB;
    });
    navbar.push(uniqueMap[group]);
  });

  return sortNavbar(navbar).map((item) => {
    const group = navbarList.find((navbar) => navbar.text === item.text);
    item.icon = group ? group.icon : item.icon;
    if (item.children.length <= 1) {
      return convertSingleNavBar(item);
    }
    return item;
  });
};

// 根据 navbar 顺序文件进行排序
const sortNavbar = (navbar: Array<NavbarGroupOptions>) => {
  navbar.sort((a, b) => {
    let orderA = navbarList.findIndex((item) => item.text === a.text) + 1 || Infinity;
    let orderB = navbarList.findIndex((item) => item.text === b.text) + 1 || Infinity;
    if (a.link === '/') {
      orderA = 0;
    } else if (b.link === '/') {
      orderB = 0;
    }
    return orderA - orderB;
  });
  return navbar;
};

// 递归读取所有配置文件
const parseConfigFiles = async (dirName: string): Promise<Array<BarConfig>> => {
  const configs: Array<BarConfig> = [];
  if (dirName.startsWith('.')) {
    return configs;
  }
  const files = fs.readdirSync(dirName);
  let hasRead = false;
  for (let i = 0; i < files.length; i++) {
    const tempPath = path.join(dirName, files[i]);
    if (files[i].startsWith('.')) {
      continue;
    }
    if (fs.lstatSync(tempPath).isDirectory()) {
      configs.push(...(await parseConfigFiles(tempPath)));
    } else if (files[i].endsWith('.js') && !hasRead) {
      const result = await import(/* @vite-ignore */ path.join(__dirname, '../../../', tempPath));
      if (result.default) {
        configs.push(result.default as BarConfig);
        hasRead = true;
      }
    }
  }
  return configs;
};

export default async function () {
  const config = await parseConfigFiles(configPath);
  const sidebar = loadSidebar(config);
  const navbar = loadNavbar(defaultNavbar, config);
  return {
    sidebar,
    navbar,
  };
}
