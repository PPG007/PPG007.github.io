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
  icon?: string;
}

interface BarConfig {
  sidebar: SidebarConfig;
  navbar: NavbarConfig;
}

export { SidebarChildren, SidebarConfig, NavbarConfig, BarConfig };
