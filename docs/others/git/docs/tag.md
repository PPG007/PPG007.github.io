# 标签管理

Git 标签就是指向某个 commit 的指针，通过标签可以将一个简单、有意义的标签名和某个提交绑定在一起。

由于标签总是和某个 commit 绑定，所以如果一个 commit 既出现在 master 分支，又出现在 dev 分支，那么在这两个分支上都可以看到这个标签。

## 创建标签

标签分为轻量标签和附注标签，附注标签还包含信息。

创建附注标签：`git tag -a <tagname> -m <msg>`。

创建轻量标签：`git tag <tagname> [commit]`，其中 commit 可以不指定，默认是最新提交。

## 操作标签

查看标签的说明：`git show <tagname>`。

推送标签到远程仓库：使用 `git push <repository> <tagname>` 推送一个标签，如果想推送全部未推送的本地标签，可以使用 `git push <repository> --tags`。

删除本地标签：`git tag -d <tagname>`。

删除一个远程标签：`git push <repository> :refs/tags/<tagname>` 或者 `git push <repository> --delete <tagname>`。
