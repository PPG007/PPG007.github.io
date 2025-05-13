# 远程仓库

## 管理远程仓库

- 添加远程仓库：
  - 使用 `git remote add <name> <url>` 命令添加一个远程仓库并制定一个名字。
- 推送本地版本库到远程仓库：
  - 第一次推送使用 `git push -u <name> <branch>` 命令推送本地的一个分支到远程仓库，通过 `-u` 参数，Git 不但会推送版本库的内容，还会把本地的分支和远程的分支关联起来，简化后续的推送。
  - 第二次及以后推送使用 `git push <name> <branch>` 命令就能实现推送。
- 删除远程仓库：

  使用 `git remote rm <name>` 命令即可删除与指定名字的远程仓库的关联。

- 重命名远程仓库：

  使用 `git remote rename <old> <new>` 命令修改远程仓库的名字。

- 查看某个远程仓库的信息：

  使用 `git remote show <name>` 命令查看某个远程仓库的详细信息。

## 从远程仓库克隆

`git clone <url>`。
