const fs = require('fs')
const path = require('path')

let navbar = [{ text: '首页', link: '/' }];
let sidebar = {};
let subConfigs = [];

// 根据各个子配置 index.json 生成总的 sidebar 配置对象
function loadSidebar(oldSidebar, subConfigs) {
  subConfigs.forEach(config => {
    const sidebar = transToV1Sidebar(config.sidebar);
    if (sidebar !== null && sidebar !== undefined) {
      oldSidebar = {
        ...oldSidebar,
        ...sidebar,
      }
    }
  });
  return oldSidebar;
}

function transToV1Sidebar(sidebar) {
  const key = Object.keys(sidebar)[0];
  const sidebars = sidebar[key];
  let children = [];
  sidebars.forEach(s => {
    s.children.forEach(c => {
      children.push(c);
    });

  });
  return {
    [key]: children,
  };
}

// 根据各个子配置 index.json 生成总的 navbar 配置对象
function loadNavbar(oldNavbar, subConfigs) {
  const navbarConfig = loadNavbarConfigWithOrder();
  subConfigs.forEach(config => {
    const group = config.navbar.group;
    let singleNavbar = navbarConfig.get(group);
    if (singleNavbar === undefined) {
      return;
    }
    singleNavbar.items.push({
      text: config.navbar.text,
      icon: config.navbar.icon,
      // 防止自动拼接 .html 后缀导致 404
      link: config.navbar.link + '/',
    });
  });
  navbarConfig.forEach((v, k) => {
    oldNavbar.push(v);
  })
  return oldNavbar;
}

function loadNavbarConfigWithOrder() {
  const data = fs.readFileSync('docs/.vuepress/config/navbarOrder.json', 'utf-8');
  const order = JSON.parse(data);
  let keys = Object.keys(order);
  keys.sort((a, b) => {
    const orderA = order[a];
    const orderB = order[b];
    return orderA - orderB;
  });
  let navbarConfig = new Map();
  keys.forEach(k => {
    navbarConfig.set(k, {
      text: k,
      items: [],
      icon: '',
    });
  });
  return navbarConfig;
}

// 递归读取所有 index.json 配置文件
function readSubConfig(dirName) {
  if (dirName.startsWith('.')) {
    return;
  }
  const files = fs.readdirSync(dirName);
  for (let i = 0; i < files.length; i++) {
    const tempPath = path.join(dirName, files[i]);
    if (files[i].startsWith('.')) {
      continue;
    }
    if (fs.lstatSync(tempPath).isDirectory()) {
      readSubConfig(tempPath);
    } else if (files[i] == 'index.json') {
      const data = fs.readFileSync(tempPath, 'utf-8');
      temp = JSON.parse(data);
      subConfigs.push(temp);
    }
  }
}

readSubConfig('docs');
sidebar = loadSidebar(sidebar, subConfigs);
navbar = loadNavbar(navbar, subConfigs);
module.exports.navbar = navbar;
module.exports.sidebar = sidebar;
