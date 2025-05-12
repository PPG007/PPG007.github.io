import { NavbarOptions, NavbarGroupOptions, NavbarLinkOptions, SidebarOptions, SidebarObjectOptions } from '@vuepress/theme-default';
import fs from 'fs';
import path from 'path';
import navbarList from './navbarList';

interface SidebarChildren {
  text: string;
  children: Array<string>;
}

interface SidebarConfig {
  [key: string]: Array<SidebarChildren>;
}

interface NavbarConfig {
  group: string;
  text: string;
  link: string;
}

interface BarConfig {
  sidebar: SidebarConfig;
  navbar: NavbarConfig;
}

const jsonConfigFile = 'index.json';
const jsConfigFile = 'index.js';
const tsConfigFile = 'index.ts';
const defaultNavbar: Array<NavbarGroupOptions> = [{ text: '首页', link: '/', children: [] }];

// 根据各个子配置生成总的 sidebar 配置对象
const loadSidebar = (configs: Array<BarConfig>): SidebarOptions => {
  const sidebar: SidebarObjectOptions = {};
  configs.forEach(({ sidebar: config }) => {
    Object.keys(config).forEach((key) => {
      sidebar[key] = config[key];
    })
  });
  return sidebar;
}
const formatLink = (link: string): string => {
  if (link.endsWith('/')) {
    return link;
  }
  return `${link}/`
}
// 根据各个子配置 index.json 生成总的 navbar 配置对象
const loadNavbar = (navbar: Array<NavbarGroupOptions>, configs: Array<BarConfig>): NavbarOptions => {
  const uniqueMap: {
    [key: string]: NavbarGroupOptions;
  } = {};
  configs.forEach(config => {
    const { navbar: { group, text, link } } = config;
    if (!Object.keys(uniqueMap).includes(group)) {
      uniqueMap[group] = {
        text: group,
        children: [
          {
            text: text,
            link: formatLink(link),
          },
        ],
      }
    } else {
      const currentChildren = uniqueMap[group].children;
      currentChildren.push({
        text: text,
        link: formatLink(link),
      });
      uniqueMap[group].children = currentChildren;
    }
  });
  Object.keys(uniqueMap).forEach((v) => {
    navbar.push(uniqueMap[v]);
  });

  return sortNavbar(navbar).map((item) => {
    if (!item.children.length) {
      const temp: NavbarLinkOptions = {
        text: item.text,
        link: item.link || '/',
      };
      return temp;
    }
    return item;
  });
}

// 根据 navbar 顺序文件进行排序
const sortNavbar = (navbar: Array<NavbarGroupOptions>) => {
  navbar.sort((a, b) => {
    const orderA = navbarList.indexOf(a.text);
    const orderB = navbarList.indexOf(b.text);
    if (orderA === undefined) {
      return 1;
    } else if (orderB === undefined) {
      return -1;
    }
    return orderA - orderB;
  })
  return navbar;
}

// 递归读取所有 index.json 配置文件
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
      configs.push(...await parseConfigFiles(tempPath));
    } else if (files[i] === jsonConfigFile && !hasRead) {
      const data = fs.readFileSync(tempPath, 'utf-8');
      const temp = JSON.parse(data) as BarConfig;
      configs.push(temp);
      hasRead = true;
    } else if ([jsConfigFile, tsConfigFile].includes(files[i]) && !hasRead) {
      const result = await import(path.join(__dirname, '../../../', tempPath));
      configs.push(result.default as BarConfig);
      hasRead = true;
    }
  }
  return configs;
}
export default async function () {
  const config = await parseConfigFiles('docs')
  const sidebar = loadSidebar(config);
  const navbar = loadNavbar(defaultNavbar, config);
  return {
    sidebar,
    navbar,
  };
}
