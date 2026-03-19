import { BarConfig } from '@doc-types';

const config: BarConfig = {
  sidebars: [
    {
      children: [
        'install.md',
        'basic.md',
        'type.md',
        'variable.md',
        'const.md',
        'expression.md',
        'operator.md',
        'control.md',
        'function.md',
        'class.md',
        'namespace.md',
        'enum.md',
        'exception.md',
        'fiber.md',
        'generator.md',
      ],
    },
  ],
  text: 'PHP',
  icon: 'material-icon-theme:php-elephant',
  dir: __dirname,
};

export default config;
