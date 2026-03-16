interface Sidebar {
  text?: string;
  prefix?: string;
  icon?: string;
  children: Array<string>;
}

interface BarConfig {
  text?: string;
  icon?: string;
  navbarText?: string;
  navbarIcon?: string;
  sidebars?: Array<Sidebar>;
  devMode?: boolean;
  dir: string;
}

interface GroupConfig {
  text: string;
  icon?: string;
  dir: string;
  children?: Array<BarConfig>;
}

type GroupConfigs = Array<GroupConfig>;

export { Sidebar, BarConfig, GroupConfig, GroupConfigs };
