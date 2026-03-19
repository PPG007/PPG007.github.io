import {
  NavbarOptions,
  NavbarGroupOptions,
  NavbarLinkOptions,
  SidebarOptions,
  SidebarObjectOptions,
  SidebarArrayOptions,
  SidebarGroupOptions,
} from 'vuepress-theme-hope';
import { GroupConfig, GroupConfigs } from '../types';
import fs from 'fs';
import path from 'path';

const isDevMode = () => {
  if (!process || !process.env || process.env.MODE !== 'development') {
    return false;
  }
  return true;
};

const defaultNavbar: Array<NavbarGroupOptions> = [
  { text: '首页', link: '/', icon: 'material-symbols:home', children: [] },
];

const parseDir = (dir: string): string => {
  return dir.split('/').slice(-1)[0];
};

const formatLink = (link: string): string => {
  if (link.endsWith('/')) {
    return link;
  }
  return `${link}/`;
};

const joinLinks = (...links: Array<string>): string => {
  const items: Array<string> = [];
  links.forEach((link) => {
    if (!link) {
      return;
    }
    items.push(link.replace(/^\//, '').replace(/\/$/, ''));
  });
  return items.join('/');
};

const convertSingleNavBar = (item: NavbarGroupOptions): NavbarLinkOptions | NavbarGroupOptions => {
  if (item.children && item.children.length) {
    return item;
  }
  return {
    text: item.text,
    link: item.link || '/',
    icon: item.icon,
  };
};

// 根据各个子配置生成总的 sidebar 配置对象
const loadSidebar = (configs: Array<GroupConfig>): SidebarOptions => {
  const options: SidebarObjectOptions = {};
  configs.forEach(({ dir, children }) => {
    if (!children) {
      return;
    }
    children.forEach(({ sidebars, devMode, dir: subDir }) => {
      if (!sidebars || (devMode && !isDevMode())) {
        return;
      }
      const key = `/${parseDir(dir)}/${parseDir(subDir)}`;
      const values: SidebarArrayOptions = [];
      sidebars.forEach((sidebar) => {
        const children = sidebar.children.map((child) => joinLinks('docs', sidebar.prefix || '', child));
        if (sidebar.text) {
          const temp: SidebarGroupOptions = {
            text: sidebar.text,
            icon: sidebar.icon,
            children,
          };
          values.push(temp);
          return;
        }
        values.push(...children);
      });
      options[key] = values;
    });
  });
  return options;
};

// 根据各个子配置生成总的 navbar 配置对象
const loadNavbar = (navbars: Array<NavbarGroupOptions>, configs: Array<GroupConfig>): NavbarOptions => {
  const navbarTextList = navbars.map((item) => item.text);
  const options: NavbarOptions = navbars.map((item) => {
    return convertSingleNavBar(item);
  });
  configs.forEach(({ text, dir, icon, children }) => {
    if (navbarTextList.includes(text)) {
      return;
    }
    navbarTextList.push(text);
    options.push(
      convertSingleNavBar({
        text,
        icon,
        prefix: parseDir(dir),
        children:
          children
            ?.filter(({ devMode }) => !devMode || isDevMode())
            .map((child, index) => {
              return {
                text: child.text || child.navbarText || `${text} - ${index + 1}`,
                icon: child.icon || child.navbarIcon,
                link: formatLink(parseDir(child.dir)),
              };
            }) || [],
      }),
    );
  });

  return options;
};

const parseGroupConfigFiles = async (dirName: string): Promise<Array<GroupConfig>> => {
  const jsPath = path.join(dirName, 'index.js');
  const isJsExist = fs.existsSync(jsPath);
  if (!isJsExist) {
    return [];
  }
  const jsConfig = await import(/* @vite-ignore */ path.join(__dirname, '../../../', jsPath));
  if (!jsConfig || !jsConfig.default || !jsConfig.default.default) {
    return [];
  }
  return jsConfig.default.default as GroupConfigs;
};

const configPath = 'docs/.vuepress/config';

export default async function () {
  const config = await parseGroupConfigFiles(configPath);
  const sidebar = loadSidebar(config);
  const navbar = loadNavbar(defaultNavbar, config);
  return {
    sidebar,
    navbar,
  };
}
