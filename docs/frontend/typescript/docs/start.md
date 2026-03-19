# 起步

## 安装 TypeScript

```shell
mkdir playground
cd playground
# please install yarn before next command
yarn init
yarn add typescript
```

## Hello World

main.ts:

```ts
function helloWorld(name: string) {
  console.log(`I am ${name}, hello TypeScript!`);
}

const me = 'PPG007';
helloWorld(me);
```

然后执行 `tsc main.ts`，此时会得到一个 `main.js` 文件，这个文件就是执行编译的结果，执行这个 js 文件即可。
