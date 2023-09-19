const fs = require('fs')
const path = require('path')

let navbar = [{ text: '首页', link: '/' }];
let sidebar = {};
let subConfigs = [];

// 根据各个子配置 index.json 生成总的 sidebar 配置对象
function loadSidebar(oldSidebar, subConfigs) {
  let sidebar = oldSidebar;
  subConfigs.forEach(config => {
    sidebar = {
      ...sidebar,
      ...config.sidebar,
    }
  });
  return sidebar;
}

// 根据各个子配置 index.json 生成总的 navbar 配置对象
function loadNavbar(oldNavbar, subConfigs) {
  let temp = new Map();
  subConfigs.forEach(config => {
    const group = config.navbar.group;
    if (temp.get(group) === undefined) {
      temp.set(group, {
        'text': group,
        "children": [
          {
            'text': config.navbar.text,
            'link': config.navbar.link,
          },
        ],
      })
    } else {
      const oldChildren = temp.get(group).children;
      oldChildren.push({
        'text': config.navbar.text,
        'link': config.navbar.link,
      });
      temp.set(group, {
        'text': group,
        "children": oldChildren,
      });
    }
  });

  temp.forEach((v) => {
    oldNavbar.push(v)
  })

  return sortNavbar(oldNavbar, 'docs/.vuepress/config/navbarOrder.json');
}

// 根据 navbar 顺序文件进行排序
function sortNavbar(navbar, orderFileName) {
  const data = fs.readFileSync(orderFileName, 'utf-8');
  const order =  JSON.parse(data);
  navbar.sort((a, b) => {
    const orderA = order[a.text];
    const orderB = order[b.text];
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
function readSubConfig(dirName) {
  if (dirName.startsWith('.')) {
    return;
  }
  const files = fs.readdirSync(dirName);
  let hasRead = false;
  for (let i = 0; i < files.length; i++) {
    const tempPath = path.join(dirName, files[i]);
    if (files[i].startsWith('.')) {
      continue;
    }
    if (fs.lstatSync(tempPath).isDirectory()) {
      readSubConfig(tempPath);
    } else if (files[i] == 'index.json' && !hasRead) {
      const data = fs.readFileSync(tempPath, 'utf-8');
      temp = JSON.parse(data);
      subConfigs.push(temp);
      hasRead = true;
    } else if (files[i] == 'index.js' && !hasRead) {
      const module = require(path.join(__dirname, '../../../', tempPath));
      subConfigs.push(module.default);
      hasRead = true;
    }
  }
}

readSubConfig('docs');
sidebar = loadSidebar(sidebar, subConfigs);
navbar = loadNavbar(navbar, subConfigs);
module.exports.navbar = navbar;
module.exports.sidebar = sidebar;
