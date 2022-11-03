import{_ as t,r as l,o as c,c as o,a as s,d as p,F as u,e as a,b as n}from"./app.b1e8d3cf.js";const r={},i=a('<h1 id="\u5B58\u50A8" tabindex="-1"><a class="header-anchor" href="#\u5B58\u50A8" aria-hidden="true">#</a> \u5B58\u50A8</h1><p>Kubernetes \u652F\u6301\u5F88\u591A\u7C7B\u578B\u7684\u5377\uFF0CPod \u53EF\u4EE5\u540C\u65F6\u4F7F\u7528\u4EFB\u610F\u6570\u76EE\u7684\u5377\u7C7B\u578B\u3002\u4E34\u65F6\u5377\u7C7B\u578B\u7684\u58F0\u660E\u5468\u671F\u4E0E Pod \u76F8\u540C\uFF0C\u4F46\u6301\u4E45\u5377\u53EF\u4EE5\u6BD4 Pod \u5B58\u6D3B\u671F\u957F\uFF0C\u5F53 Pod \u4E0D\u518D\u5B58\u5728\u65F6\uFF0CKubernetes \u4F1A\u9500\u6BC1\u4E34\u65F6\u5377\u4F46\u4E0D\u4F1A\u9500\u6BC1\u6301\u4E45\u5377\u3002\u5BF9\u4E8E\u7ED9\u5B9A Pod \u4E2D\u4EFB\u4F55\u7C7B\u578B\u7684\u5377\uFF0C\u5728\u5BB9\u5668\u91CD\u542F\u671F\u95F4\u6570\u636E\u90FD\u4E0D\u4F1A\u4E22\u5931\u3002</p><p>\u5377\u7684\u6838\u5FC3\u662F\u4E00\u4E2A\u76EE\u5F55\uFF0C\u5176\u4E2D\u53EF\u80FD\u5B58\u6709\u6570\u636E\uFF0CPod \u4E2D\u7684\u5BB9\u5668\u53EF\u4EE5\u8BBF\u95EE\u8BE5\u76EE\u5F55\u4E2D\u7684\u6570\u636E\u3002 \u6240\u91C7\u7528\u7684\u7279\u5B9A\u7684\u5377\u7C7B\u578B\u5C06\u51B3\u5B9A\u8BE5\u76EE\u5F55\u5982\u4F55\u5F62\u6210\u7684\u3001\u4F7F\u7528\u4F55\u79CD\u4ECB\u8D28\u4FDD\u5B58\u6570\u636E\u4EE5\u53CA\u76EE\u5F55\u4E2D\u5B58\u653E\u7684\u5185\u5BB9\u3002</p><p>\u4F7F\u7528\u5377\u65F6, \u5728 <code>.spec.volumes</code> \u5B57\u6BB5\u4E2D\u8BBE\u7F6E\u4E3A Pod \u63D0\u4F9B\u7684\u5377\uFF0C\u5E76\u5728 <code>.spec.containers[*].volumeMounts</code> \u5B57\u6BB5\u4E2D\u58F0\u660E\u5377\u5728\u5BB9\u5668\u4E2D\u7684\u6302\u8F7D\u4F4D\u7F6E\u3002 \u5BB9\u5668\u4E2D\u7684\u8FDB\u7A0B\u770B\u5230\u7684\u6587\u4EF6\u7CFB\u7EDF\u89C6\u56FE\u662F\u7531\u5B83\u4EEC\u7684 \u5BB9\u5668\u955C\u50CF \u7684\u521D\u59CB\u5185\u5BB9\u4EE5\u53CA\u6302\u8F7D\u5728\u5BB9\u5668\u4E2D\u7684\u5377\uFF08\u5982\u679C\u5B9A\u4E49\u4E86\u7684\u8BDD\uFF09\u6240\u7EC4\u6210\u7684\u3002 \u5176\u4E2D\u6839\u6587\u4EF6\u7CFB\u7EDF\u540C\u5BB9\u5668\u955C\u50CF\u7684\u5185\u5BB9\u76F8\u543B\u5408\u3002 \u4EFB\u4F55\u5728\u8BE5\u6587\u4EF6\u7CFB\u7EDF\u4E0B\u7684\u5199\u5165\u64CD\u4F5C\uFF0C\u5982\u679C\u88AB\u5141\u8BB8\u7684\u8BDD\uFF0C\u90FD\u4F1A\u5F71\u54CD\u63A5\u4E0B\u6765\u5BB9\u5668\u4E2D\u8FDB\u7A0B\u8BBF\u95EE\u6587\u4EF6\u7CFB\u7EDF\u65F6\u6240\u770B\u5230\u7684\u5185\u5BB9\u3002</p><p>\u5377\u6302\u8F7D\u5728\u955C\u50CF\u4E2D\u7684\u6307\u5B9A\u8DEF\u5F84\u4E0B\u3002 Pod \u914D\u7F6E\u4E2D\u7684\u6BCF\u4E2A\u5BB9\u5668\u5FC5\u987B\u72EC\u7ACB\u6307\u5B9A\u5404\u4E2A\u5377\u7684\u6302\u8F7D\u4F4D\u7F6E\u3002</p><p>\u5377\u4E0D\u80FD\u6302\u8F7D\u5230\u5176\u4ED6\u5377\u4E4B\u4E0A\uFF0C\u4E5F\u4E0D\u80FD\u4E0E\u5176\u4ED6\u5377\u6709\u786C\u94FE\u63A5\u3002</p>',6),k=n("Kubernetes \u652F\u6301\u591A\u79CD\u7C7B\u578B\u7684\u5377\uFF0C\u53C2\u8003"),b={href:"https://kubernetes.io/zh/docs/concepts/storage/volumes/#volume-types",target:"_blank",rel:"noopener noreferrer"},m=n("\u8FD9\u91CC"),y=n("\u3002"),d=a(`<h2 id="configmap-\u548C-secret" tabindex="-1"><a class="header-anchor" href="#configmap-\u548C-secret" aria-hidden="true">#</a> configMap \u548C secret</h2><p>configMap \u5377\u63D0\u4F9B\u4E86\u5411 Pod \u6CE8\u5165\u914D\u7F6E\u6570\u636E\u7684\u65B9\u6CD5\u3002 ConfigMap \u5BF9\u8C61\u4E2D\u5B58\u50A8\u7684\u6570\u636E\u53EF\u4EE5\u88AB configMap \u7C7B\u578B\u7684\u5377\u5F15\u7528\uFF0C\u7136\u540E\u88AB Pod \u4E2D\u8FD0\u884C\u7684\u5BB9\u5668\u5316\u5E94\u7528\u4F7F\u7528\u3002</p><p>\u5F15\u7528 configMap \u5BF9\u8C61\u65F6\uFF0C\u4F60\u53EF\u4EE5\u5728 volume \u4E2D\u901A\u8FC7\u5B83\u7684\u540D\u79F0\u6765\u5F15\u7528\u3002 \u4F60\u53EF\u4EE5\u81EA\u5B9A\u4E49 ConfigMap \u4E2D\u7279\u5B9A\u6761\u76EE\u6240\u8981\u4F7F\u7528\u7684\u8DEF\u5F84\u3002 \u4E0B\u9762\u7684\u914D\u7F6E\u663E\u793A\u4E86\u5982\u4F55\u5C06\u540D\u4E3A log-config \u7684 ConfigMap \u6302\u8F7D\u5230\u540D\u4E3A configmap-pod \u7684 Pod \u4E2D\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> configmap<span class="token punctuation">-</span>pod
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> test
      <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox<span class="token punctuation">:</span><span class="token number">1.28</span>
      <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>vol
          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /etc/config
  <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>vol
      <span class="token key atrule">configMap</span><span class="token punctuation">:</span>
        <span class="token key atrule">name</span><span class="token punctuation">:</span> log<span class="token punctuation">-</span>config
        <span class="token key atrule">items</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> log_level
            <span class="token key atrule">path</span><span class="token punctuation">:</span> log_level
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><p>log-config ConfigMap \u4EE5\u5377\u7684\u5F62\u5F0F\u6302\u8F7D\uFF0C\u5E76\u4E14\u5B58\u50A8\u5728 log_level \u6761\u76EE\u4E2D\u7684\u6240\u6709\u5185\u5BB9\u90FD\u88AB\u6302\u8F7D\u5230 Pod \u7684 /etc/config/log_level \u8DEF\u5F84\u4E0B\u3002 \u8BF7\u6CE8\u610F\uFF0C\u8FD9\u4E2A\u8DEF\u5F84\u6765\u6E90\u4E8E\u5377\u7684 mountPath \u548C log_level \u952E\u5BF9\u5E94\u7684 path\u3002</p><div class="custom-container tip"><p class="custom-container-title">TIP</p><ul><li>\u5728\u4F7F\u7528 ConfigMap \u4E4B\u524D\u4F60\u9996\u5148\u8981\u521B\u5EFA\u5B83\u3002</li><li>\u5BB9\u5668\u4EE5 subPath \u5377\u6302\u8F7D\u65B9\u5F0F\u4F7F\u7528 ConfigMap \u65F6\uFF0C\u5C06\u65E0\u6CD5\u63A5\u6536 ConfigMap \u7684\u66F4\u65B0\u3002</li><li>\u6587\u672C\u6570\u636E\u6302\u8F7D\u6210\u6587\u4EF6\u65F6\u91C7\u7528 UTF-8 \u5B57\u7B26\u7F16\u7801\u3002\u5982\u679C\u4F7F\u7528\u5176\u4ED6\u5B57\u7B26\u7F16\u7801\u5F62\u5F0F\uFF0C\u53EF\u4F7F\u7528 binaryData \u5B57\u6BB5\u3002</li></ul></div><p>secret \u540C\u6837\u53EF\u4EE5\u901A\u8FC7 <code>spec.volumes.secret.secretName</code> \u6302\u8F7D\u5230 Pod \u4E2D\u3002</p><h2 id="pv-\u4E0E-pvc" tabindex="-1"><a class="header-anchor" href="#pv-\u4E0E-pvc" aria-hidden="true">#</a> PV \u4E0E PVC</h2><p>\u6301\u4E45\u5377 PV \u662F\u96C6\u7FA4\u4E2D\u7684\u4E00\u5757\u5B58\u50A8\uFF0C\u53EF\u4EE5\u4E8B\u5148\u4F9B\u5E94\u6216\u8005\u4F7F\u7528\u5B58\u50A8\u7C7B\u6765\u52A8\u6001\u4F9B\u5E94\uFF0C\u6301\u4E45\u5377\u662F\u96C6\u7FA4\u8D44\u6E90\u3002</p><p>\u6301\u4E45\u5377\u7533\u9886 PVC \u8868\u8FBE\u7684\u662F\u7528\u6237\u5BF9\u5B58\u50A8\u7684\u8BF7\u6C42\uFF0CPod \u4F1A\u6D88\u8017\u8282\u70B9\u8D44\u6E90\uFF0CPVC \u4F1A\u6D88\u8017 PV \u8D44\u6E90\uFF0CPVC \u4E5F\u53EF\u4EE5\u7533\u8BF7\u7279\u5B9A\u5927\u5C0F\u7684 PV \u4EE5\u53CA\u8BBF\u95EE\u6A21\u5F0F\u3002</p><h2 id="\u9759\u6001\u4F9B\u5E94\u548C\u52A8\u6001\u4F9B\u5E94" tabindex="-1"><a class="header-anchor" href="#\u9759\u6001\u4F9B\u5E94\u548C\u52A8\u6001\u4F9B\u5E94" aria-hidden="true">#</a> \u9759\u6001\u4F9B\u5E94\u548C\u52A8\u6001\u4F9B\u5E94</h2><p>\u9759\u6001\u4F9B\u5E94\uFF1A</p><p>\u96C6\u7FA4\u7BA1\u7406\u5458\u521B\u5EFA\u82E5\u5E72 PV \u5377\uFF0C\u8FD9\u4E9B\u5377\u5BF9\u8C61\u5E26\u6709\u771F\u5B9E\u5B58\u50A8\u7684\u7EC6\u8282\u4FE1\u606F\uFF0C\u5E76\u4E14\u5BF9\u96C6\u7FA4\u7528\u6237\u53EF\u89C1\uFF0C\u53EF\u4F9B\u6D88\u8D39\u4F7F\u7528\u3002</p><p>\u52A8\u6001\u4F9B\u5E94\uFF1A</p><p>\u5982\u679C\u9759\u6001 PV \u65E0\u6CD5\u6EE1\u8DB3\uFF0C\u96C6\u7FA4\u53EF\u4EE5\u5C1D\u8BD5\u4E3A\u8BE5 PVC \u7533\u8BF7\u52A8\u6001\u4F9B\u5E94\u4E00\u4E2A\u5B58\u50A8\u5377\uFF0C\u8FD9\u4E00\u4F9B\u5E94\u64CD\u4F5C\u662F\u7ED9\u4E88\u5B58\u50A8\u7C7B StorageClass \u6765\u5B9E\u73B0\u7684\uFF0CPVC \u5FC5\u987B\u8BF7\u6C42\u67D0\u4E2A\u5B58\u50A8\u7C7B\uFF0C\u540C\u65F6\u6025\u7FA4\u4F17\u5FC5\u987B\u521B\u5EFA\u5E76\u914D\u7F6E\u4E86\u8FD9\u4E2A\u7C7B\u3002</p><h2 id="\u5B58\u50A8\u7C7B-storageclass" tabindex="-1"><a class="header-anchor" href="#\u5B58\u50A8\u7C7B-storageclass" aria-hidden="true">#</a> \u5B58\u50A8\u7C7B StorageClass</h2><p>\u6BCF\u4E2A StorageClass \u90FD\u5305\u542B provisioner\uFF08\u5B58\u50A8\u5236\u5907\u5668\uFF09\u3001parameters\uFF08\u53C2\u6570\uFF09 \u548C reclaimPolicy\uFF08\u56DE\u6536\u7B56\u7565\uFF09 \u5B57\u6BB5\uFF0C \u8FD9\u4E9B\u5B57\u6BB5\u4F1A\u5728 StorageClass \u9700\u8981\u52A8\u6001\u5206\u914D PersistentVolume \u65F6\u4F1A\u4F7F\u7528\u5230\u3002</p><p>\u4E0B\u9762\u662F\u4E00\u4E2A local \u672C\u5730\u5377\u7684\u793A\u4F8B\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">kind</span><span class="token punctuation">:</span> StorageClass
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> storage.k8s.io/v1
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> local<span class="token punctuation">-</span>storage
<span class="token key atrule">provisioner</span><span class="token punctuation">:</span> kubernetes.io/no<span class="token punctuation">-</span>provisioner
<span class="token key atrule">volumeBindingMode</span><span class="token punctuation">:</span> WaitForFirstConsumer
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h3 id="\u56DE\u6536\u7B56\u7565" tabindex="-1"><a class="header-anchor" href="#\u56DE\u6536\u7B56\u7565" aria-hidden="true">#</a> \u56DE\u6536\u7B56\u7565</h3><p>StorageClass \u7684 reclaimPolicy \u5B57\u6BB5\u53EF\u4EE5\u6307\u5B9A\u4F1A\u641C\u72D0\u7B56\u7565\uFF0C\u53EF\u9009\u4E3A Delete \u548C Retain\uFF0C\u9ED8\u8BA4\u662F Delete\u3002</p><p>Delete\uFF1A\u52A8\u6001\u4F9B\u5E94\u7684 PV \u9ED8\u8BA4\u7684\u7B56\u7565\uFF0C\u5220\u9664\u65F6\u4F1A\u5C06 PV \u4ECE\u96C6\u7FA4\u4E2D\u5220\u9664\uFF0C\u540C\u65F6\u4E5F\u4F1A\u4ECE\u5916\u90E8 NFS \u7B49\u5377\u63D2\u4EF6\u4E2D\u5220\u9664\u3002</p><p>Retain\uFF1A\u624B\u52A8\u521B\u5EFA\u7684 PV \u9ED8\u8BA4\u7684\u7B56\u7565\uFF0C\u7528\u6237\u53EF\u4EE5\u624B\u52A8\u56DE\u6536\u8D44\u6E90\uFF0C\u5F53\u4F7F\u7528 PV \u7684\u5BF9\u8C61\u88AB\u5220\u9664\u65F6\uFF0CPV \u4ECD\u7136\u5B58\u5728\uFF0C\u5BF9\u5E94\u7684\u6570\u636E\u5377\u72B6\u6001\u53D8\u4E3A\u5DF2\u91CA\u653E\u3002</p><h2 id="local" tabindex="-1"><a class="header-anchor" href="#local" aria-hidden="true">#</a> local</h2><p>local \u5377\u6240\u4EE3\u8868\u7684\u662F\u67D0\u4E2A\u88AB\u6302\u8F7D\u7684\u672C\u5730\u5B58\u50A8\u8BBE\u5907\uFF0C\u53EA\u80FD\u7528\u4F5C\u9759\u6001\u521B\u5EFA\u7684\u6301\u4E45\u5377\uFF0C\u4E0D\u652F\u6301\u52A8\u6001\u914D\u7F6E\u3002\u5982\u679C\u8282\u70B9\u53D8\u5F97\u4E0D\u5065\u5EB7\uFF0C\u90A3\u4E48 local \u5377\u4E5F\u5C06\u53D8\u5F97\u4E0D\u53EF\u88AB Pod \u8BBF\u95EE\u3002\u672C\u5730\u5377\u4E0D\u652F\u6301\u52A8\u6001\u7EB8\u676F\uFF0C\u4F46\u662F\u8FD8\u662F\u9700\u8981\u521B\u5EFA StorageClass \u4EE5\u5EF6\u8FDF\u5377\u7ED1\u5B9A\uFF0C\u76F4\u5230\u5B8C\u6210 Pod \u8C03\u5EA6\uFF0C\u8FD9\u662F\u7531 WaitForFirstConsumer \u5377\u7ED1\u5B9A\u6A21\u5F0F\u6307\u5B9A\u7684\u3002</p><p>\u4F7F\u7528\u4E0B\u9762\u7684\u914D\u7F6E\u6587\u4EF6\u521B\u5EFA\u4E00\u6B21 Deployment \u5E76\u6302\u8F7D local \u5377\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">kind</span><span class="token punctuation">:</span> StorageClass
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> storage.k8s.io/v1
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> local<span class="token punctuation">-</span>storage
<span class="token key atrule">provisioner</span><span class="token punctuation">:</span> kubernetes.io/no<span class="token punctuation">-</span>provisioner
<span class="token key atrule">volumeBindingMode</span><span class="token punctuation">:</span> WaitForFirstConsumer
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> PersistentVolume
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> localpv<span class="token punctuation">-</span>demo
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">capacity</span><span class="token punctuation">:</span>
    <span class="token key atrule">storage</span><span class="token punctuation">:</span> 100Mi <span class="token comment"># \u9650\u5236\u5927\u5C0F</span>
  <span class="token key atrule">volumeMode</span><span class="token punctuation">:</span> Filesystem
  <span class="token key atrule">accessModes</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> ReadOnlyMany <span class="token comment"># \u53EA\u8BFB</span>
  <span class="token key atrule">persistentVolumeReclaimPolicy</span><span class="token punctuation">:</span> Delete <span class="token comment"># \u56DE\u6536\u7B56\u7565</span>
  <span class="token key atrule">storageClassName</span><span class="token punctuation">:</span> local<span class="token punctuation">-</span>storage
  <span class="token key atrule">local</span><span class="token punctuation">:</span>
    <span class="token key atrule">path</span><span class="token punctuation">:</span> /root/configrations <span class="token comment"># \u5BBF\u4E3B\u673A\u8DEF\u5F84</span>
  <span class="token key atrule">nodeAffinity</span><span class="token punctuation">:</span> <span class="token comment"># local \u5377\u5FC5\u987B\u6307\u5B9A\u8282\u70B9\u4EB2\u548C\u6027</span>
    <span class="token key atrule">required</span><span class="token punctuation">:</span>
      <span class="token key atrule">nodeSelectorTerms</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">matchExpressions</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">key</span><span class="token punctuation">:</span> kubernetes.io/os
          <span class="token key atrule">operator</span><span class="token punctuation">:</span> In
          <span class="token key atrule">values</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> linux
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> PersistentVolumeClaim
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> local<span class="token punctuation">-</span>demo<span class="token punctuation">-</span>claim
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">accessModes</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> ReadOnlyMany
  <span class="token key atrule">resources</span><span class="token punctuation">:</span>
    <span class="token key atrule">requests</span><span class="token punctuation">:</span>
      <span class="token key atrule">storage</span><span class="token punctuation">:</span> 10Mi
  <span class="token key atrule">storageClassName</span><span class="token punctuation">:</span> local<span class="token punctuation">-</span>storage
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>demo
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>demo
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">2</span>
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>demo
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">imagePullSecrets</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> myali<span class="token punctuation">-</span>docker
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>demo
        <span class="token key atrule">image</span><span class="token punctuation">:</span> registry.cn<span class="token punctuation">-</span>qingdao.aliyuncs.com/ppg007/volume<span class="token punctuation">-</span>demo
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> Always
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> application
            <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /root/configuration
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> application
          <span class="token key atrule">persistentVolumeClaim</span><span class="token punctuation">:</span>
            <span class="token key atrule">claimName</span><span class="token punctuation">:</span> local<span class="token punctuation">-</span>demo<span class="token punctuation">-</span>claim
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>service
  <span class="token key atrule">name</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>service
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8000</span>
    <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>demo
  <span class="token key atrule">type</span><span class="token punctuation">:</span> ClusterIP
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> ingress<span class="token punctuation">-</span>volume<span class="token punctuation">-</span>demo
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ingressClassName</span><span class="token punctuation">:</span> nginx
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> client.com
      <span class="token key atrule">http</span><span class="token punctuation">:</span>
        <span class="token key atrule">paths</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">path</span><span class="token punctuation">:</span> /config
            <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
            <span class="token key atrule">backend</span><span class="token punctuation">:</span>
              <span class="token key atrule">service</span><span class="token punctuation">:</span>
                <span class="token key atrule">name</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>service
                <span class="token key atrule">port</span><span class="token punctuation">:</span>
                  <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">8000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br></div></div><h2 id="nfs" tabindex="-1"><a class="header-anchor" href="#nfs" aria-hidden="true">#</a> nfs</h2><p>\u5B89\u88C5 nfs server\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># \u5728\u6240\u6709\u8282\u70B9\u6267\u884C</span>
<span class="token function">apt-get</span> <span class="token function">install</span> nfs-kernel-server
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>\u5728\u4E3B\u8282\u70B9\u6267\u884C\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment">#nfs\u4E3B\u8282\u70B9</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;/nfs/data/ *(insecure,rw,sync,no_root_squash)&quot;</span> <span class="token operator">&gt;</span> /etc/exports

<span class="token function">mkdir</span> -p /nfs/data
systemctl <span class="token builtin class-name">enable</span> rpcbind --now
systemctl <span class="token builtin class-name">enable</span> nfs-server --now
<span class="token comment">#\u914D\u7F6E\u751F\u6548</span>
exportfs -r
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>\u5728\u4ECE\u8282\u70B9\u6267\u884C\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment">#\u6267\u884C\u4EE5\u4E0B\u547D\u4EE4\u6302\u8F7D nfs \u670D\u52A1\u5668\u4E0A\u7684\u5171\u4EAB\u76EE\u5F55\u5230\u672C\u673A\u8DEF\u5F84 /root/nfsmount</span>
<span class="token function">mkdir</span> -p /nfs/data
<span class="token function">mount</span> -t nfs master:/nfs/data /nfs/data
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>NFS \u6CA1\u6709\u5185\u7F6E\u7684\u5B58\u50A8\u5236\u5907\u5668\uFF0C\u901A\u8FC7\u4E0B\u9762\u7684\u914D\u7F6E\u6587\u4EF6\u6765\u521B\u5EFA\uFF1A</p>`,35),v=n("\u9996\u5148\u6267\u884C"),g={href:"https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner/blob/master/deploy/rbac.yaml",target:"_blank",rel:"noopener noreferrer"},h=n("\u8FD9\u4E2A"),f=n("\u914D\u7F6E\u6587\u4EF6\uFF0C\u521B\u5EFA ServiceAccount\u3002\u6CE8\u610F\u5C06\u5176\u4E2D\u7684 default \u66FF\u6362\u6210\u8981\u90E8\u7F72\u7684\u547D\u540D\u7A7A\u95F4\u3002"),P=a(`<div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> nfs<span class="token punctuation">-</span>client<span class="token punctuation">-</span>provisioner
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> nfs<span class="token punctuation">-</span>client<span class="token punctuation">-</span>provisioner
  <span class="token key atrule">strategy</span><span class="token punctuation">:</span>
    <span class="token key atrule">type</span><span class="token punctuation">:</span> Recreate
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> nfs<span class="token punctuation">-</span>client<span class="token punctuation">-</span>provisioner
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">serviceAccountName</span><span class="token punctuation">:</span> nfs<span class="token punctuation">-</span>client<span class="token punctuation">-</span>provisioner
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nfs<span class="token punctuation">-</span>client<span class="token punctuation">-</span>provisioner
          <span class="token key atrule">image</span><span class="token punctuation">:</span> k8s.gcr.io/sig<span class="token punctuation">-</span>storage/nfs<span class="token punctuation">-</span>subdir<span class="token punctuation">-</span>external<span class="token punctuation">-</span>provisioner<span class="token punctuation">:</span>v4.0.2
          <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nfs<span class="token punctuation">-</span>client<span class="token punctuation">-</span>root
              <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /persistentvolumes
          <span class="token key atrule">env</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> PROVISIONER_NAME
              <span class="token key atrule">value</span><span class="token punctuation">:</span> k8s<span class="token punctuation">-</span>sigs.io/nfs<span class="token punctuation">-</span>subdir<span class="token punctuation">-</span>external<span class="token punctuation">-</span>provisioner
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> NFS_SERVER
              <span class="token key atrule">value</span><span class="token punctuation">:</span> master
            <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> NFS_PATH
              <span class="token key atrule">value</span><span class="token punctuation">:</span> /nfs/data
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nfs<span class="token punctuation">-</span>client<span class="token punctuation">-</span>root
          <span class="token key atrule">nfs</span><span class="token punctuation">:</span>
            <span class="token key atrule">server</span><span class="token punctuation">:</span> master
            <span class="token key atrule">path</span><span class="token punctuation">:</span> /nfs/data
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br></div></div><p>\u7136\u540E\u5C31\u53EF\u4EE5\u5728 StorageClass \u4E2D\u4F7F\u7528\u4E0A\u9762\u7684 PROVISIONER_NAME \u73AF\u5883\u53D8\u91CF\u503C\u505A\u5B58\u50A8\u5236\u5907\u5668\u4E86\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> storage.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StorageClass
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> nfs<span class="token punctuation">-</span>client
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">provisioner</span><span class="token punctuation">:</span> k8s<span class="token punctuation">-</span>sigs.io/nfs<span class="token punctuation">-</span>subdir<span class="token punctuation">-</span>external<span class="token punctuation">-</span>provisioner <span class="token comment"># or choose another name, must match deployment&#39;s env PROVISIONER_NAME&#39;</span>
<span class="token key atrule">parameters</span><span class="token punctuation">:</span>
  <span class="token key atrule">archiveOnDelete</span><span class="token punctuation">:</span> <span class="token string">&quot;false&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>\u7136\u540E\u521B\u5EFA\u6D4B\u8BD5\u7528 PVC \u53CA Pod\uFF0C\u5E76\u5C06 PVC \u7ED1\u5B9A\u7ED9 Pod\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">kind</span><span class="token punctuation">:</span> PersistentVolumeClaim
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test<span class="token punctuation">-</span>claim
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">storageClassName</span><span class="token punctuation">:</span> nfs<span class="token punctuation">-</span>client
  <span class="token key atrule">accessModes</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> ReadWriteMany
  <span class="token key atrule">resources</span><span class="token punctuation">:</span>
    <span class="token key atrule">requests</span><span class="token punctuation">:</span>
      <span class="token key atrule">storage</span><span class="token punctuation">:</span> 1Mi
<span class="token punctuation">---</span>
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> test<span class="token punctuation">-</span>pod
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> test<span class="token punctuation">-</span>pod
    <span class="token key atrule">image</span><span class="token punctuation">:</span> busybox<span class="token punctuation">:</span>stable
    <span class="token key atrule">command</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;/bin/sh&quot;</span>
    <span class="token key atrule">args</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;-c&quot;</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;touch /mnt/SUCCESS &amp;&amp; exit 0 || exit 1&quot;</span>
    <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nfs<span class="token punctuation">-</span>pvc
        <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">&quot;/mnt&quot;</span>
  <span class="token key atrule">restartPolicy</span><span class="token punctuation">:</span> <span class="token string">&quot;Never&quot;</span>
  <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nfs<span class="token punctuation">-</span>pvc
      <span class="token key atrule">persistentVolumeClaim</span><span class="token punctuation">:</span>
        <span class="token key atrule">claimName</span><span class="token punctuation">:</span> test<span class="token punctuation">-</span>claim
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br></div></div><p>\u5728 Pod complete \u4E4B\u540E\uFF0C\u5373\u53EF\u5728 nfs \u7684\u76EE\u5F55\u4E2D\u770B\u5230\u65B0\u5185\u5BB9\u3002</p><p>\u4E0B\u9762\u6765\u4F7F\u7528 nfs \u505A\u4E00\u4E2A\u539F\u751F\u6302\u8F7D\uFF0C\u521B\u5EFA\u4E00\u4E2A Deployment\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>demo
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>demo
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">2</span>
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>demo
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">imagePullSecrets</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> myali<span class="token punctuation">-</span>docker
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>demo
        <span class="token key atrule">image</span><span class="token punctuation">:</span> registry.cn<span class="token punctuation">-</span>qingdao.aliyuncs.com/ppg007/volume<span class="token punctuation">-</span>demo
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> Always
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> application
            <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /root/configuration
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> application
          <span class="token key atrule">nfs</span><span class="token punctuation">:</span>
            <span class="token key atrule">server</span><span class="token punctuation">:</span> master
            <span class="token key atrule">path</span><span class="token punctuation">:</span> /nfs/data
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>service
  <span class="token key atrule">name</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>service
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8000</span>
    <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>demo
  <span class="token key atrule">type</span><span class="token punctuation">:</span> ClusterIP
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> ingress<span class="token punctuation">-</span>volume<span class="token punctuation">-</span>demo
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ingressClassName</span><span class="token punctuation">:</span> nginx
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> client.com
      <span class="token key atrule">http</span><span class="token punctuation">:</span>
        <span class="token key atrule">paths</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">path</span><span class="token punctuation">:</span> /config
            <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
            <span class="token key atrule">backend</span><span class="token punctuation">:</span>
              <span class="token key atrule">service</span><span class="token punctuation">:</span>
                <span class="token key atrule">name</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>service
                <span class="token key atrule">port</span><span class="token punctuation">:</span>
                  <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">8000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br></div></div>`,8);function x(_,V){const e=l("ExternalLinkIcon");return c(),o(u,null,[i,s("p",null,[k,s("a",b,[m,p(e)]),y]),d,s("p",null,[v,s("a",g,[h,p(e)]),f]),P],64)}var M=t(r,[["render",x],["__file","storage.html.vue"]]);export{M as default};
