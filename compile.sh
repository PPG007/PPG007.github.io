#!/bin/bash
tsc
# 遍历当前目录下所有以 kb- 开头的目录
for dir in kb-*/; do
  # 检查是否是目录（防止通配符匹配到非目录文件）
  if [ -d "$dir" ]; then
    # 进入目录
    cd "$dir" || continue

    # 执行 tsc 命令
    echo "compiling $dir"
    tsc

    # 返回上一级目录
    cd ..
  fi
done
