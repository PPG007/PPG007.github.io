# Basic

## 起步

安装 i18next：

```shell
yarn add i18next
```

然后定义国际化文件：

```js
// i18n/locales/zh_cn.js
const translation = {
  click: '点击',
};

export default translation;
```

然后配置 i18next：

```js
import i18next from 'i18next';
import en from './locales/en_us';
import zh from './locales/zh_cn';

const config = {
  debug: true,
  resources: {
    zh: {
      translation: zh,
    },
    en: {
      translation: en,
    },
  },
  lng: 'zh',
};

i18next.init(config);

export default i18next;
```

最后可以调用 translate 方法：

```js
import { log } from 'console';
import i18n from '../i18n';
log(i18n.t('click'));
```

## 命名空间

命名空间是 i18next 国际化框架中的一个功能，它允许将多个文件中的翻译分开。在较小的项目中，将所有内容放在一个文件中可能是合理的，当项目逐渐增大，多个模块之间有不同的、相同的国际化定义，这时就需要拆分。例如将通用的部分放置在一个 common 命名空间，其他模块放置在自己的命名空间中，例如：

```js
// i18n/locales/modules/member/zh_cn.js
const translation = {
  member: '客户'
};

export default translation;
// i18n/locales/modules/account/zh_cn.js
const translation = {
  account: '账户'
};

export default translation;
// i18n/locales/modules/index.js
import member_zh from './member/zh_cn';
import member_en from './member/en_us';
import account_zh from './account/zh_cn';
import account_en from './account/en_us';

export default {
  zh: {
    member: member_zh,
    account: account_zh,
  },
  en: {
    member: member_en,
    account: account_en,
  }
}
// i18n/index.js
import i18next from "i18next";
import common_en from "./locales/en_us";
import common_zh from "./locales/zh_cn";
import modules from "./locales/modules";

const config = {
  debug: true,
  resources: {
    zh: {
      common: common_zh,
      ...modules.zh,
    },
    en: {
      common: common_en,
      ...modules.en,
    },
  },
  lng: 'zh',
  defaultNS: 'common',
  ns: ['common', 'member', 'account']
};

i18next.init(config);

export default i18next;
```

现在就可以根据不同的命名空间来访问国际化文件了，以访问 account 模块为例，由于默认命名空间是 common，因此要访问 account 模块需要明确指定命名空间，可以有以下几种写法：

```js
import { log } from 'console';
import i18n from '../i18n';
log(i18n.t('account:account'));
log(i18n.t('account', { ns: 'account' }));
```

## 嵌套、上下文与动态内容

如果国际化中包含对象嵌套，可以通过 `.` 来访问：

```js
const translation = {
  click: '点击',
  a: {
    b: '嵌套',
  },
};

log(i18n.t('a.b'));
```

对于一些场景，根据上下文的不同，国际化文本会有一些差异，可以使用上下文实现，例如：

```js
const translation = {
  number: '数字',
  number_odd: '奇数',
  number_even: '偶数',
};

log(i18n.t('number', { context: 'even' }));
```

默认情况下是使用 `_` 分隔上下文和国际化键的。

有时需要将动态内容嵌入国际化文本中，这时可以使用动态替换：

```js
const translation = {
  click: '点击',
  a: {
    b: '嵌套',
  },
  count: '当前数字是 {{count}}',
};

log(i18n.t('count', { count: 123 }));
```

默认情况下，动态内容要使用双括号包裹起来，这个符号可以通过 i18next 初始化配置设置：

```js
const config: InitOptions = {
  // ...
  interpolation: {
    prefix: '<<',
    suffix: '>>'
  }
};
```

现在将国际化文件中的双大括号替换为双尖括号即可，除了动态参数标志字符可以配置外，命名空间等均可配置。

也可以通过对象的形式访问动态数据：

```js
const translation = {
  click: '点击',
  author: {
    name: '当前作者是：<<author.name>>',
    age: '当前作者年龄是：<<author.age>>',
  },
};

log(i18n.t('author.name', { author: { name: 'PPG007' } }));
```

国际化文件中也可以嵌套其他国际化文本：

```js
const translation = {
  click: '点击 {{age}}',
  author: {
    name: '当前作者是：{{author.name}}, $t(click, {\"author\": {{author.age}} })',
    age: '当前作者年龄是：{{author.age}}',
  },
};
```

## TypeScript

对于 TypeScript 项目，如果是编译为 CommonJS，可以参考下面的 TypeScript 配置：

```json
{
  "compilerOptions": {
    "strict": true,
    "module": "CommonJS",
    "target": "ES6",
    "outDir": "lib",
    "moduleResolution": "Node10",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src", "@types", "i18n"]
}
```

这种情况下，esModuleInterop 和 allowSyntheticDefaultImports 都要设置为 true。

为了实现对国际化键的 TypeScript 支持，需要自定义类型声明：

```ts
// @types/resources.ts
import common from '../i18n/locales/zh_cn';
import modules from '../i18n/locales/modules';

const resources = {
  common,
  ...modules.zh,
} as const;

export default resources;

export const defaultNS = 'common';
// @types/i18next.d.ts
import resources, { defaultNS } from './resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources;
    defaultNS: typeof defaultNS;
  }
}
```

::: tip

需要注意 i18next 的版本号，某些版本对 TypeScript 的支持有问题，上面代码基于 23.7.6。

:::

## React

对于使用 React 的情况，直接使用 i18next-react：

```shell
yarn install react-i18next i18next
```

配置与普通用法完全一致，只是需要使用插件来提供 React Hooks 的支持：

```ts
i18n.use(I18nextBrowserLanguageDetector).use(initReactI18next).init(initOption);
```

initReactI18next 用于提供 Hooks 支持，I18nextBrowserLanguageDetector 会根据系统设置判断使用什么语言，在使用这个插件的情况下配置项中就不要指定语言了，这个插件对应的语言键参照[Wiki](https://en.wikipedia.org/wiki/IETF_language_tag#List_of_common_primary_language_subtags)。

然后在组件中：

```tsx
function App() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  return (
    <Fragment>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        {t('countTip', { myCount: count })}
      </button>
    </Fragment>
  );
}
```
