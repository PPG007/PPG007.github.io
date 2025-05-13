# 分支管理

## 创建与合并分支

最开始的时候，默认分支 master 是一条线，Git 使用 master 指向最新的提交，然后再使用 `HEAD` 指向 `master`，这样就确定了当前分支，以及当前分支的提交点。

每次提交，master 分支都会向前移动一步，随着不断提交，master 分支的线也越来越长。

当创建一个新分支例如 dev 分支时，Git 会新建一个名字为 dev 的指针，指向 master 相同的提交，再把 HEAD 指向 dev，就表示当前分支在 dev 上。

- 创建分支的四种方式：
  - 使用 `git checkout -b <branch>` 创建并切换到指定分支。
  - 使用 `git switch -c <branch>` 创建并切换到指定分支。
  - 使用 `git branch <branch>` 创建一个分支。
  - 使用 `git fetch <repository> :<branch>`创建一个新分支。
- 删除指定分支：

  使用 `git branch -d <branch>` 命令删除一个分支。

- 删除一个没有被合并过的分支：

  使用 `git branch -D <branch>` 命令强行删除。

- 删除一个远程分支：

  使用 `git push <repository>  ：<branch>`。

- 切换分支：
  - 使用 `git switch <branch>` 命令切换到指定分支。
  - 使用 `git checkout <branch>` 命令切换到指定分支。
- 查看分支信息：

  使用 `git branch` 命令查看当前分支和其他分支。

- 合并分支：

  合并某个分支到当前分支：`git merge <name>`。

## 解决冲突

当两个分支共同前进时可能会出现下面的情况。

![合并前](./images/合并前.png)

这种情况下，Git 无法执行快速合并只能尝试把各自的修改合并起来，但这样可能Hi出现冲突，Git 会告诉我们在哪个文件中出现了冲突，必须由我们手动修改解决冲突后再提交，提交后分支变成了下面这样：

![合并后](./images/合并后.png)

## 分支管理策略

通常情况下，合并分支时，Git 会用 Fast forward 模式，这种模式在删除分支后会丢掉分支信息。

如果要禁用这个模式，Git 会在 merge 时生成一个新的 commit，这样从分支历史上就可以看出分支信息。

使用 `git merge --no-ff -m <message> <branch>` 命令，通过 `-no-ff` 参数禁用 Fast forward 模式，由于这样合并会创建一个新的 commit，所以加上 `-m` 参数，把提交信息写进去。

不使用 Fast forward 模式合并后就像下面这样：

![--no-ff](./images/--no-ff.png)

反之像这样：

![ff](./images/ff.png)

## Bug 分支

当任务没有完成无法提交，而又有了新任务时，可以使用 Git 提供的 stash 功能暂存当前工作现场，将来恢复现场后继续工作。

使用 `git stash` 命令将当前还在工作区的内容暂存起来。

完成其他任务后，使用 `git stash apply` 命令可以恢复工作区，但这个命令不会删除 stash 的内容，需要再使用 `git stash drop` 删除 stash 中的内容，或者直接使用 `git stash  pop` 命令一次完成恢复和删除。

通过 `git stash list` 可以查看所有的 stash，然后通过 `git stash apply stash@{<id>}` 恢复指定的 stash。

如果只想复制某次提交所做的修改而不是合并整个分支，可以使用 `git cherry-pick <commit>` 可以复制一个特定的提交到当前分支。

## 多人协作

多人协作的流程如下：

- 克隆远程仓库到本地。
- 创建新分支或在已有的开发分支上进行开发。
- 提交到本地仓库。
- 尝试向远程仓库推送。
- 如果推送失败，使用 `git fetch` 然后再使用 `git merge` 或者 `git rebase` 两个命令或者直接使用 `git pull` 同步远程仓库。
- 如果 `git pull` 提示 `no tracking information` 说明本地分支和远程分支的链接关系没有创建，使用命令 `git branch --set-upstream-to <branch> ${repository}/${branch}`。
- 如果和远程仓库有冲突就先解决冲突并提交。
- 没有冲突后推送到远程仓库。

## Rebase

在进行分支合并时，有 `merge` 和 `rebase` 两种选择，merge 会再次创建一次提交作为合并后的起点，rebase 不会创建提交，而是将要合并的分支直接移动到要并入的分支的顶端。

![merge](./images/merge.svg)

![rebase](./images/rebase.svg)

使用 `git rebase <branch>` 命令将当前分支变基到指定分支，如果发生了冲突，就先解决冲突，然后使用 `git rebase --continue` 完成后续操作。还可以添加 `-i` 参数使用交互式 rebase。
