interface NavbarGroup {
  text: string;
  icon?: string;
}
const groups: Array<NavbarGroup> = [
  {
    text: '前端',
    icon: 'devicon-plain:devicon',
  },
  {
    text: 'Java',
    icon: 'material-icon-theme:java',
  },
  {
    text: 'Go',
    icon: 'logos:go',
  },
  {
    text: 'Node',
    icon: 'skill-icons:nodejs-light',
  },
  {
    text: 'PHP',
    icon: 'skill-icons:php-dark',
  },
  {
    text: '云相关',
    icon: 'hugeicons:cloud-server',
  },
  {
    text: '数据库',
    icon: 'iconoir:database-tag-solid',
  },
  {
    text: 'others',
    icon: 'material-icon-theme:folder-other',
  },
];

export default groups;
