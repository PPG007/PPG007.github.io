import{_ as n,e as a}from"./app.b1e8d3cf.js";const s={},p=a(`<h1 id="configmap" tabindex="-1"><a class="header-anchor" href="#configmap" aria-hidden="true">#</a> ConfigMap</h1><p>ConfigMap \u5141\u8BB8\u5C06\u914D\u7F6E\u6587\u4EF6\u4E0E\u955C\u50CF\u6587\u4EF6\u5206\u79BB\u3002</p><h2 id="\u4F7F\u7528-kubectl-\u521B\u5EFA-configmap" tabindex="-1"><a class="header-anchor" href="#\u4F7F\u7528-kubectl-\u521B\u5EFA-configmap" aria-hidden="true">#</a> \u4F7F\u7528 kubectl \u521B\u5EFA ConfigMap</h2><p>\u6267\u884C\u4E0B\u9762\u7684\u547D\u4EE4\u53EF\u4EE5\u5728\u6307\u5B9A\u540D\u79F0\u7A7A\u95F4\u521B\u5EFA\u4E00\u4E2A ConfigMap\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>kubectl create configmap application-config --from-file<span class="token operator">=</span>application.toml -n example
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>\u5176\u4E2D application-config \u662F\u8FD9\u4E2A ConfigMap \u7684\u540D\u5B57\uFF0Cfrom-file \u53EF\u4EE5\u662F\u5355\u4E2A\u6587\u4EF6\u4E5F\u53EF\u4EE5\u662F\u76EE\u5F55\uFF0C<code>--from-env-file</code> \u53C2\u6570\u53EF\u4EE5\u4ECE\u73AF\u5883\u6587\u4EF6\u521B\u5EFA ConfigMap\uFF0C\u73AF\u5883\u6587\u4EF6\u6BCF\u4E00\u884C\u5FC5\u987B\u662F k=v \u7684\u683C\u5F0F\uFF0C\u5982\u679C\u4F7F\u7528\u4E86\u591A\u4E2A <code>--from-env-file</code> \u53C2\u6570\uFF0C\u53EA\u6709\u6700\u540E\u4E00\u4E2A\u73AF\u5883\u6587\u4EF6\u4F1A\u751F\u6548\u3002</p><p>\u4F7F\u7528 <code>--from-file</code> \u53C2\u6570\u65F6\uFF0C\u53EF\u4EE5\u4F7F\u7528\u4E0B\u9762\u8FD9\u79CD\u5F62\u5F0F\u81EA\u5B9A\u4E49\u952E\u540D\u53D6\u4EE3\u9ED8\u8BA4\u4F7F\u7528\u6587\u4EF6\u540D\u7684\u884C\u4E3A\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>kubectl create configmap application-config --from-file<span class="token operator">=</span>key<span class="token operator">=</span>application.toml -n example
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p><code>--from-literal</code> \u53C2\u6570\u53EF\u4EE5\u901A\u8FC7\u76F4\u63A5\u5728\u547D\u4EE4\u4E2D\u6307\u5B9A\u5B57\u9762\u91CF\u6765\u521B\u5EFA ConfigMap\u3002</p><h2 id="\u914D\u7F6E\u6587\u4EF6\u521B\u5EFA" tabindex="-1"><a class="header-anchor" href="#\u914D\u7F6E\u6587\u4EF6\u521B\u5EFA" aria-hidden="true">#</a> \u914D\u7F6E\u6587\u4EF6\u521B\u5EFA</h2><p>\u4F7F\u7528\u4E0B\u9762\u7684\u914D\u7F6E\u6587\u4EF6\u53EF\u4EE5\u521B\u5EFA\u4E00\u4E2A ConfigMap\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ConfigMap
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> application<span class="token punctuation">-</span>config
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">application.toml</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
    [mysql]</span>

    url = &quot;mysql<span class="token punctuation">:</span>//localhost<span class="token punctuation">:</span>3306&quot;
    username = &quot;root&quot;
    password = &quot;123456&quot;

    <span class="token punctuation">[</span>mongodb<span class="token punctuation">]</span>

    url = &quot;mongo<span class="token punctuation">:</span>//localhost<span class="token punctuation">:</span>27017&quot;
    username = &quot;mongo&quot;
    password = &quot;654321&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><h2 id="\u4F7F\u7528-configmap-\u5B9A\u4E49-pod-\u73AF\u5883\u53D8\u91CF" tabindex="-1"><a class="header-anchor" href="#\u4F7F\u7528-configmap-\u5B9A\u4E49-pod-\u73AF\u5883\u53D8\u91CF" aria-hidden="true">#</a> \u4F7F\u7528 ConfigMap \u5B9A\u4E49 Pod \u73AF\u5883\u53D8\u91CF</h2><h3 id="\u4F7F\u7528\u5355\u4E00-configmap" tabindex="-1"><a class="header-anchor" href="#\u4F7F\u7528\u5355\u4E00-configmap" aria-hidden="true">#</a> \u4F7F\u7528\u5355\u4E00 ConfigMap</h3><p>\u521B\u5EFA\u4E0B\u9762\u7684\u8FD9\u4E2A Deployment \u5E76\u5C06\u4E00\u4E2A ConfigMap \u6302\u8F7D\u8FDB\u53BB\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
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
        <span class="token key atrule">image</span><span class="token punctuation">:</span> registry.cn<span class="token punctuation">-</span>qingdao.aliyuncs.com/ppg007/volume<span class="token punctuation">-</span>demo<span class="token punctuation">:</span><span class="token number">2.0</span>
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> Always
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> DEMO_ENV
            <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
              <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span>
                <span class="token key atrule">name</span><span class="token punctuation">:</span> application<span class="token punctuation">-</span>config
                <span class="token key atrule">key</span><span class="token punctuation">:</span> application.toml
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br></div></div><h3 id="\u4F7F\u7528\u591A\u4E2A-configmap" tabindex="-1"><a class="header-anchor" href="#\u4F7F\u7528\u591A\u4E2A-configmap" aria-hidden="true">#</a> \u4F7F\u7528\u591A\u4E2A ConfigMap</h3><p>\u4E0B\u9762\u7684 Deployment \u4F7F\u7528\u4E86\u4E24\u4E2A ConfigMap\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
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
        <span class="token key atrule">image</span><span class="token punctuation">:</span> registry.cn<span class="token punctuation">-</span>qingdao.aliyuncs.com/ppg007/volume<span class="token punctuation">-</span>demo<span class="token punctuation">:</span><span class="token number">2.0</span>
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> Always
        <span class="token key atrule">env</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> DEMO_ENV
            <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
              <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span>
                <span class="token key atrule">name</span><span class="token punctuation">:</span> application<span class="token punctuation">-</span>config
                <span class="token key atrule">key</span><span class="token punctuation">:</span> application.toml
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> USERNAME
            <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
              <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span>
                <span class="token key atrule">name</span><span class="token punctuation">:</span> cm2
                <span class="token key atrule">key</span><span class="token punctuation">:</span> username
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> PASSWORD
            <span class="token key atrule">valueFrom</span><span class="token punctuation">:</span>
              <span class="token key atrule">configMapKeyRef</span><span class="token punctuation">:</span>
                <span class="token key atrule">name</span><span class="token punctuation">:</span> cm2
                <span class="token key atrule">key</span><span class="token punctuation">:</span> password
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
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br></div></div><h3 id="\u5C06-configmap-\u4E2D\u7684\u6240\u6709\u952E\u503C\u5BF9\u914D\u7F6E\u4E3A\u5BB9\u5668\u73AF\u5883\u53D8\u91CF" tabindex="-1"><a class="header-anchor" href="#\u5C06-configmap-\u4E2D\u7684\u6240\u6709\u952E\u503C\u5BF9\u914D\u7F6E\u4E3A\u5BB9\u5668\u73AF\u5883\u53D8\u91CF" aria-hidden="true">#</a> \u5C06 ConfigMap \u4E2D\u7684\u6240\u6709\u952E\u503C\u5BF9\u914D\u7F6E\u4E3A\u5BB9\u5668\u73AF\u5883\u53D8\u91CF</h3><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
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
        <span class="token key atrule">image</span><span class="token punctuation">:</span> registry.cn<span class="token punctuation">-</span>qingdao.aliyuncs.com/ppg007/volume<span class="token punctuation">-</span>demo<span class="token punctuation">:</span><span class="token number">2.0</span>
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> Always
        <span class="token key atrule">envFrom</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">configMapRef</span><span class="token punctuation">:</span>
              <span class="token key atrule">name</span><span class="token punctuation">:</span> cm2
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div><h2 id="\u5C06-configmap-\u4E2D\u7684\u6570\u636E\u6DFB\u52A0\u5230\u5377" tabindex="-1"><a class="header-anchor" href="#\u5C06-configmap-\u4E2D\u7684\u6570\u636E\u6DFB\u52A0\u5230\u5377" aria-hidden="true">#</a> \u5C06 ConfigMap \u4E2D\u7684\u6570\u636E\u6DFB\u52A0\u5230\u5377</h2><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
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
        <span class="token key atrule">image</span><span class="token punctuation">:</span> registry.cn<span class="token punctuation">-</span>qingdao.aliyuncs.com/ppg007/volume<span class="token punctuation">-</span>demo<span class="token punctuation">:</span><span class="token number">2.0</span>
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> Always
        <span class="token key atrule">envFrom</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">configMapRef</span><span class="token punctuation">:</span>
              <span class="token key atrule">name</span><span class="token punctuation">:</span> cm2
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> application
            <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /root/configuration
          <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>volume
            <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /etc/config
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> application
          <span class="token key atrule">nfs</span><span class="token punctuation">:</span>
            <span class="token key atrule">server</span><span class="token punctuation">:</span> master
            <span class="token key atrule">path</span><span class="token punctuation">:</span> /nfs/data
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>volume
          <span class="token key atrule">configMap</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> cm2
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br></div></div><p>\u4E0A\u9762\u7684\u914D\u7F6E\u6587\u4EF6\u4F1A\u5728 /etc/config \u76EE\u5F55\u4E2D\u521B\u5EFA cm2 ConfigMap \u4E2D\u7684\u6BCF\u4E2A\u952E\u503C\u5BF9\uFF0C\u952E\u4E3A\u6587\u4EF6\u540D\uFF0C\u6587\u4EF6\u5185\u5BB9\u4E3A\u503C\u3002\u8FD9\u79CD\u65B9\u5F0F\u4E2D\uFF0C/etc/config \u76EE\u5F55\u4E2D\u539F\u6709\u5185\u5BB9\u4F1A\u88AB\u6E05\u9664\u3002</p>`,24);function e(t,l){return p}var u=n(s,[["render",e],["__file","configMap.html.vue"]]);export{u as default};
