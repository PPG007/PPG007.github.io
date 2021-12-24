# Git 入门教程

## 什么是 Git

Git 是一个分布式版本控制系统，每个人的电脑上都是一个完整的版本库，工作时不需要联网，和集中式版本控制系统相比，安全性要高很多。

Git 跟踪并管理的是修改，而不是文件。

## Git 基础知识

### 创建版本库

版本库可以理解为一个目录，这个目录里所有的文件都可以被 Git 管理起来，每个文件的修改、删除都能被 Git 跟踪，任何时刻都可以追踪历史，或者还原。

要创建版本库，在一个目录下使用如下命令：

```shell
git init
```

这样这个目录就成为了一个版本库，其中有个隐藏目录 `.git`，其中保存着这个仓库的一些信息。

### 添加文件到版本库

注意：**所有的版本控制系统只能跟踪文本文件的改动，二进制文件无法跟踪变化。**

现在创建一个文件 `README.txt` 文件，使用下面的命令将文件添加到暂存区：

```shell
git add README.txt
```

接着，执行下面的命令将暂存区中的文件提交给仓库：

```shell
# -m 用来指定这次提交的信息
git commit -m 'init'
```

Git 使用 `add` 和 `commit` 两步实现添加文件，其中 `commit` 可以一次提交很多文件，所以可以多次 `add` 不同内容然后一起 `commit`。

### 查看仓库状态和提交历史

使用 `git status` 命令可以查看当前仓库的状态，如果想要查看未提交的文件和仓库中文件的区别可以使用 `git diff <file>` 命令查看修改的内容。

使用 `git log` 命令查看过往的提交历史记录，添加 `--graph` 参数可以以图形的形式看到提交记录。

### 工作区和暂存区

- 工作区：

    工作区就是在电脑中可以看到的目录。

- 版本库：

    工作区中有一个隐藏目录 `.git`，这就是 Git 的版本库。

- 暂存区：

    暂存区就存在于版本库中，此外版本库中还有 Git自动创建的第一个分支 master，以及指向 master 的一个指针 HEAD。

    `git add` 命令将文件添加到了暂存区，然后 `git commit` 提交暂存区的所有内容到当前分支的仓库，即将需要提交的文件修改都放到暂存区然后一次性提交暂存区中的所有修改，执行完 `git commit` 命令后，暂存区会被清空。

### 撤销修改

- 如果要丢弃的修改还存在工作区中，可以使用 `git checkout -- <file>` 撤销修改，Git 会使用版本库中最新的版本做一次替换。
- 如果要丢弃的修改已经进入暂存区，可以使用 `git reset HEAD <file>` 将暂存区的修改撤销重新放回工作区，然后使用上面的命令即可撤销。
- 如果要丢弃的修改已经被提交到了版本库中，可以使用下面两个方法完成撤销：
    - 使用 `git reset --hard <commit>` 回到某次提交并丢弃后面的所有提交。
    - 使用 `git revert <commit>` 通过反向操作撤销某次修改并形成一个新的 commit，常用于希望撤销某次修改单不想丢弃后面的修改的情况。
- 如果在撤销修改后，又希望回到后面的某个版本，使用 `git log` 无法看到丢弃修改后面的 commit id，可以使用 `git reflog` 查看命令历史，然后可以回退。

### 删除文件

一般情况下会使用 `rm` 命令删除某些文件，此时 Git 知道有文件被删除了，工作区和版本库不一致了，此时有两种情况：

- 确实要删除这些文件。

    使用 `git rm <file>` 命令删掉，然后 `git commit`。

- 意外删除。

    使用 `git checkout -- <file>` 命令恢复到版本库的最新版本，但是会丢失未提交的修改。

## 远程仓库

### 管理远程仓库

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

### 从远程仓库克隆

## 分支管理

### 创建与合并分支

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

### 解决冲突

当两个分支共同前进时可能会出现下面的情况。

![合并前](https://www.liaoxuefeng.com/files/attachments/919023000423040/0)

这种情况下，Git 无法执行快速合并只能尝试把各自的修改合并起来，但这样可能Hi出现冲突，Git 会告诉我们在哪个文件中出现了冲突，必须由我们手动修改解决冲突后再提交，提交后分支变成了下面这样：

![合并后](https://www.liaoxuefeng.com/files/attachments/919023031831104/0)

### 分支管理策略

通常情况下，合并分支时，Git 会用 Fast forward 模式，这种模式在删除分支后会丢掉分支信息。

如果要禁用这个模式，Git 会在 merge 时生成一个新的 commit，这样从分支历史上就可以看出分支信息。

使用 `git merge --no-ff -m <message> <branch>` 命令，通过 `-no-ff` 参数禁用 Fast forward 模式，由于这样合并会创建一个新的 commit，所以加上 `-m` 参数，把提交信息写进去。

不使用 Fast forward 模式合并后就像下面这样：

![--no-ff](https://www.liaoxuefeng.com/files/attachments/919023225142304/0)

反之像这样：

![ff](https://www.liaoxuefeng.com/files/attachments/919022412005504/0)

### Bug 分支

当任务没有完成无法提交，而又有了新任务时，可以使用 Git 提供的 stash 功能暂存当前工作现场，将来恢复现场后继续工作。

使用 `git stash` 命令将当前还在工作区的内容暂存起来。

完成其他任务后，使用 `git stash apply` 命令可以恢复工作区，但这个命令不会删除 stash 的内容，需要再使用 `git stash drop` 删除 stash 中的内容，或者直接使用 `git stash  pop` 命令一次完成恢复和删除。

通过 `git stash list` 可以查看所有的 stash，然后通过 `git stash apply stash@{<id>}` 恢复指定的 stash。

如果只想复制某次提交所做的修改而不是合并整个分支，可以使用 `git cherry-pick <commit>` 可以复制一个特定的提交到当前分支。

### 多人协作

多人协作的流程如下：

- 克隆远程仓库到本地。
- 创建新分支或在已有的开发分支上进行开发。
- 提交到本地仓库。
- 尝试向远程仓库推送。
- 如果推送失败，使用 `git fetch` 然后再使用 `git merge` 或者 `git rebase` 两个命令或者直接使用 `git pull` 同步远程仓库。
- 如果 `git pull` 提示 `no tracking information` 说明本地分支和远程分支的链接关系没有创建，使用命令 `git branch --set-upstream-to <branch> ${repository}/${branch}`。
- 如果和远程仓库有冲突就先解决冲突并提交。
- 没有冲突后推送到远程仓库。

### Rebase

在进行分支合并时，有 `merge` 和 `rebase` 两种选择，merge 会再次创建一次提交作为合并后的起点，rebase 不会创建提交，而是将要合并的分支直接移动到要并入的分支的顶端。

![merge](https://wac-cdn.atlassian.com/dam/jcr:e229fef6-2c2f-4a4f-b270-e1e1baa94055/02.svg?cdnVersion=457)

![rebase](https://wac-cdn.atlassian.com/dam/jcr:5b153a22-38be-40d0-aec8-5f2fffc771e5/03.svg?cdnVersion=457)

使用 `git rebase <branch>` 命令将当前分支变基到指定分支，如果发生了冲突，就先解决冲突，然后使用 `git rebase --continue` 完成后续操作。还可以添加 `-i` 参数使用交互式 rebase。

## 标签管理

Git 标签就是指向某个 commit 的指针，通过标签可以将一个简单、有意义的标签名和某个提交绑定在一起。

由于标签总是和某个 commit 绑定，所以如果一个 commit 既出现在 master 分支，又出现在 dev 分支，那么在这两个分支上都可以看到这个标签。

### 创建标签

标签分为轻量标签和附注标签，附注标签还包含信息。

创建附注标签：`git tag -a <tagname> -m <msg>`。

创建轻量标签：`git tag <tagname> [commit]`，其中 commit 可以不指定，默认是最新提交。

### 操作标签

查看标签的说明：`git show <tagname>`。

推送标签到远程仓库：使用 `git push <repository> <tagname>` 推送一个标签，如果想推送全部未推送的本地标签，可以使用 `git push <repository> --tags`。

删除本地标签：`git tag -d <tagname>`。

删除一个远程标签：`git push <repository> :refs/tags/<tagname>` 或者 `git push <repository> --delete <tagname>`。

## 自定义 Git

### 忽略文件

在 Git 工作区中创建一个`.gitignore`文件，将想要忽略的文件名写入，Git就会自动忽略这些文件。

忽略文件的原则：

- 忽略操作系统自动生成的文件。
- 忽略编译生成的中间文件、可执行文件等，例如 Java 的 target 文件夹。
- 忽略自己的带有敏感信息的配置文件。

如果不希望排除某个文件而这个文件又可能被通配符包含在了忽略列表中，可以在这个文件前加 `!` 表示不排除这个文件，例如 `!.gitignore`。

如果一个文件被忽略了但还是希望能够添加到暂存区，可以使用 `git add -f` 强制添加。

如果希望检查 `.gitignore` 中的问题，可以使用 `git check-ignore` 命令检查。

### 配置文件

- Git 配置文件的位置：
    - `/etc/gitconfig` 文件，包含系统上每一个用户及他们仓库的通用配置，如果使用 `git config --system` 配置，那么 Git 会读写该文件中的配置变量，需要管理员权限。
    - `~./gitconfig` 或者 `~/.config/git/config` 文件，只针对当前用户，使用 `git config --global` 会使 Git 读写这个文件。
    - 每个仓库的 `.git/config` 文件，只针对该仓库，使用 `git config --local` 选项使 Git 读写这个文件，默认情况下使用的就是这个文件的配置，但是要进入某个仓库目录才能设置。
- 配置文件间的优先级关系：按上边的顺序向下一次递增。

### 配置别名

使用 `git config [--global] alias.<aliasName> <sourceName>` 命令可以实现给一个命令起别名，作用范围根据作用域参数而定。

## Code Review

### Commit Message

格式要求：

```text
${scope}: ${subject}
//注意空行
${description}
```

- ${scope}：必需，一般是项目目录、模块或组件的名字，用来描述本次commit的影响范围。
    - 使用小驼峰格式。
    - 嵌套层级使用 `/` 表示。
    - 涉及多个目录可以使用 `,` 分隔。
    - 无意义的层级应该省略。
    - 使用 `base` 表示基础结构、框架相关的改动，用 `misc` 表示杂项改动，用 `all` 表示大范围重构。
- ${subject}：必需，描述干什么和为什么。
    - 80个字符以内的简要说明，首字母小写，祈使句，不加句号。
    - 不要写废话，要具体到改了什么。
- ${description}：可选，详细说明。

### 流程

- 提交者发起 MR，assign 给同级同事：
    - 代码变动要尽量小且专注于一个任务，不要攒的很大或者是多个任务。
    - 需要一次性提交大量不需要 review 的文件的分两次 commit，不需要review的放在第一个 commit。
    - 如果冲突由提交者 `merge` 或 `rebase`。
- 审查者 review 代码：
    - 对各项要求进行检查，有疑问的地方留评论。
    - 如果提交者已经对之前的评论做出了修复，审查者需要确认后 resolve thread。
    - review 完成后 assign 给提交者处理。
- 提交者响应评论：
    - 确实有问题的进行修复，检查其他地方是否还有类似问题一并修改。
    - 不同意的可以讨论。
    - 完成后 assign 给审查者再次 review，不需要额外留评论。
- 审查无误后，将 MR assign 给 Leader 或项目维护者进行二次 review 合并。
