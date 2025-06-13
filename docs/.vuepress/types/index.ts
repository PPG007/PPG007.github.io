interface SidebarChildren {
  text: string;
  children: Array<string>;
}

interface SidebarConfig {
  [key: string]: Array<SidebarChildren>;
}

type NavbarGroupName = '前端' | 'Java' | 'Go' | 'PHP' | '云相关' | '数据库' | 'others';

interface NavbarConfig {
  group: NavbarGroupName;
  text: string;
  link: string;
  icon?: string;
}

interface BarConfig {
  sidebar: SidebarConfig;
  navbar: NavbarConfig;
}

interface NavbarGroup {
  text: NavbarGroupName;
  icon?: string;
  childrenOrder?: Array<string>;
}

export { SidebarChildren, SidebarConfig, NavbarConfig, BarConfig, NavbarGroup };
