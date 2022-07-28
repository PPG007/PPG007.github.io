import{_ as n,e as s}from"./app.49cd7b53.js";const a={},e=s(`<h1 id="service" tabindex="-1"><a class="header-anchor" href="#service" aria-hidden="true">#</a> Service</h1><p>\u5C06 Deployment \u66B4\u9732\u51FA\u6765\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>kubectl expose deployment grpc-demo --port<span class="token operator">=</span><span class="token number">8080</span> --target-port<span class="token operator">=</span><span class="token number">8080</span> -n example
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>\u5176\u4E2D\uFF0Cport \u662F\u8FD9\u4E2A\u66B4\u9732\u51FA\u6765\u7684\u670D\u52A1\u7684\u7AEF\u53E3\uFF0Ctarget-port \u662F pod \u4E2D\u670D\u52A1\u7684\u7AEF\u53E3\u3002</p></div><p>\u4E5F\u53EF\u4EE5\u4F7F\u7528\u914D\u7F6E\u6587\u4EF6\u5F62\u5F0F\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> grpc<span class="token punctuation">-</span>demo
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> grpc
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">5</span> <span class="token comment"># tells deployment to run 2 pods matching the template</span>
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> grpc
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> grpc<span class="token punctuation">-</span>demo
        <span class="token key atrule">image</span><span class="token punctuation">:</span> grpc<span class="token punctuation">-</span>demo<span class="token punctuation">:</span>latest
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> Never
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> demo<span class="token punctuation">-</span>service
  <span class="token key atrule">name</span><span class="token punctuation">:</span> demo<span class="token punctuation">-</span>service
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8000</span>
    <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> grpc
  <span class="token key atrule">type</span><span class="token punctuation">:</span> ClusterIP
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br></div></div><p>\u4E0A\u9762\u662F\u4F7F\u7528 type \u4E3A ClusterIP \u7684\u60C5\u51B5\uFF0C\u8FD9\u79CD\u60C5\u51B5\u4E0B\uFF0C\u53EA\u6709\u96C6\u7FA4\u4E2D\u7684\u670D\u52A1\u624D\u53EF\u4EE5\u4E92\u76F8\u4F7F\u7528 IP \u6216\u8005\u57DF\u540D\u8BBF\u95EE\uFF0C\u57DF\u540D\u7684\u89C4\u5219\u4E3A\uFF1A<code>\u670D\u52A1\u540D.\u547D\u540D\u7A7A\u95F4.svc:port</code>\uFF0C\u4F8B\u5982 <code>demo-service.example.svc:8000</code>\u3002</p><p>\u4E5F\u53EF\u4EE5\u4F7F\u7528 type \u4E3A NodePort \u7684\u5F62\u5F0F\u66B4\u9732\u670D\u52A1\uFF0C\u8FD9\u6837\u5176\u4ED6\u673A\u5668\u4E5F\u80FD\u901A\u8FC7\u96C6\u7FA4\u7AEF\u53E3\u8BBF\u95EE\u670D\u52A1\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>kubectl expose deployment grpc-demo --port<span class="token operator">=</span><span class="token number">8080</span> --target-port<span class="token operator">=</span><span class="token number">8080</span> --type<span class="token operator">=</span>NodePort -n example
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>\u6216\u8005\u5C06\u914D\u7F6E\u6587\u4EF6\u4E2D\u7684 type \u6539\u4E3A NodePort \u5373\u53EF\u3002</p>`,10);function p(t,l){return e}var o=n(a,[["render",p],["__file","service.html.vue"]]);export{o as default};
