# Job

## 普通 Job

Job 会创建一个或多个 Pods，并将继续重试 Pods 的执行，直到指定数量的 Pods 成功终止。

下面是一个简单 Job 的示例：

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: sms
  namespace: example
spec:
  template:
    spec:
      imagePullSecrets:
        - name: myali-docker
      containers:
        - name: sms
          image: registry.cn-qingdao.aliyuncs.com/ppg007/cronjob-demo:1.0
          command:
            - ./tencent-sms
      restartPolicy: Never
  backoffLimit: 4
```

job 中的 restartPolicy 只能设置为 Never 或 OnFailure。

backoffLimit 表示视 Job 为失败前的重试次数，默认情况下，Job 会持续运行，除非某个 Pod 失败（restartPolicy=Never）或者某个容器出错退出，Job 基于 backoffLimit 决定是否以及如何重试，一旦到达上限，Job 会被标记失败，其中运行的 Pods 都会被终止。

Job 完成时不会再创建新的 Pod，已有的 Pod 通常也不会被删除。可以通过 `.spec.activeDeadlineSeconds` 设置活跃期限，这是一个秒数值，无论 Job 创建了多少个 Pod，一旦 Job 运行时间到达活跃期限限制，其所有运行中的 Pod 都会被终止。

::: warning
活跃期限优先级高于 backoffLimit，如果一个 Job 正在重试一个或多个失效的 Pod，该 Job 一旦到达活跃期限，就不再部署额外的 Pod，即使重试次数还没到达 backoffLimit。
:::

### 自动清理完成的 Job

可以通过 `.spec.ttlSecondsAfterFinished` 设置 Job 成功多少秒后被清除。

## 使用 CronJob 运行定时任务

通过下面这个配置文件创建一个 CronJob：

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello
  namespace: example
spec:
  schedule: '* * * * *'
  jobTemplate:
    spec:
      template:
        spec:
          imagePullSecrets:
            - name: myali-docker
          containers:
            - name: hello
              image: registry.cn-qingdao.aliyuncs.com/ppg007/cronjob-demo:1.0
              imagePullPolicy: IfNotPresent
              command:
                - ./tencent-sms
          restartPolicy: Never
```

::: warning
Job 名称和对应的 Pod 名称不同，Pod 名称可以通过 `kubectl get jobs --watch -n example` 看到，然后使用 `kubectl logs POD_NAME` 即可看到 Pod 日志。
:::

### 开始的最后期限

`spec.startingDeadlineSeconds` 域是可选的，任务如果由于某种原因错过了调度时间，开始该任务截止时间的秒数。过了截止时间 CronJob 就不会开始任务。

### 并发性规则

`.spec.concurrencyPolicy` 声明了 CronJob 创建的任务执行时发生重叠如何处理，spec 仅能声明下列规则中的一种：

- Allow(默认)：CronJob 允许并发任务执行。
- Forbin：CronJob 不允许并发执行任务，如果新任务的执行时间到了但是老任务还没有执行完毕，CronJob 会忽略新任务的执行。
- Replace：如果新任务的执行时间到了而老任务没有执行完，CronJob 会用新任务替换当前正在运行的任务。

::: tip
并发性规则仅适用于相同 CronJob，如果有多个 CronJob，它们相应的任务总是允许并发执行。
:::
