import{_ as e,r as p,o as t,c as l,a as n,d as c,F as u,b as s,e as o}from"./app.49cd7b53.js";const r={},i=n("h1",{id:"\u4E00\u4E9B\u793A\u4F8B",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#\u4E00\u4E9B\u793A\u4F8B","aria-hidden":"true"},"#"),s(" \u4E00\u4E9B\u793A\u4F8B")],-1),k=s("\u914D\u7F6E\u53C2\u8003\uFF1A"),b={href:"https://istio.io/latest/zh/docs/reference/config/networking/",target:"_blank",rel:"noopener noreferrer"},m=s("\u53C2\u8003"),y=s("\u3002"),d=o(`<h2 id="\u5C06-http-\u670D\u52A1\u901A\u8FC7-istio-gateway-\u66B4\u9732" tabindex="-1"><a class="header-anchor" href="#\u5C06-http-\u670D\u52A1\u901A\u8FC7-istio-gateway-\u66B4\u9732" aria-hidden="true">#</a> \u5C06 HTTP \u670D\u52A1\u901A\u8FC7 Istio Gateway \u66B4\u9732</h2><p>\u9996\u5148\u901A\u8FC7 Kubernetes \u90E8\u7F72\u4E00\u4E2A HTTP Service\uFF0C\u7136\u540E\u521B\u5EFA\u4E00\u4E2A Istio Gateway\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.istio.io/v1alpha3
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Gateway
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> demo<span class="token punctuation">-</span>gateway
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">istio</span><span class="token punctuation">:</span> ingressgateway
  <span class="token key atrule">servers</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span>
      <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> http
      <span class="token key atrule">protocol</span><span class="token punctuation">:</span> HTTP
    <span class="token key atrule">hosts</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> client.com
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>\u7136\u540E\u521B\u5EFA VirtualService\uFF0C\u5E76\u4F7F\u7528\u8FD9\u4E2A Gateway\uFF0C\u6CE8\u610F Gateway \u548C VirtualService \u7684 hosts \u4E2D\u8981\u6709\u4EA4\u96C6\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.istio.io/v1alpha3
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VirtualService
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> vs<span class="token punctuation">-</span>demo
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">hosts</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> client.com
  <span class="token key atrule">gateways</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> demo<span class="token punctuation">-</span>gateway
  <span class="token key atrule">http</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">match</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">headers</span><span class="token punctuation">:</span>
        <span class="token key atrule">token</span><span class="token punctuation">:</span>
          <span class="token key atrule">exact</span><span class="token punctuation">:</span> wuhu <span class="token comment"># \u9650\u5236\u8BF7\u6C42\u5934\u4E2D\u7684 token \u5B57\u6BB5\u5FC5\u987B\u7B49\u4E8E wuhu</span>
    <span class="token key atrule">route</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">destination</span><span class="token punctuation">:</span>
          <span class="token key atrule">host</span><span class="token punctuation">:</span> grpc<span class="token punctuation">-</span>client<span class="token punctuation">-</span>service
          <span class="token key atrule">port</span><span class="token punctuation">:</span>
            <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">8000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><p>\u4E4B\u540E\u901A\u8FC7 Istio Gateway \u66B4\u9732\u51FA\u6765\u7684\u7AEF\u53E3\u8FDB\u884C\u8BBF\u95EE\u5373\u53EF\u3002</p><p>\u5411 Istio Gateway \u4E2D\u8BBE\u7F6E TLS\uFF0C\u5728\u4E0D\u4FEE\u6539 Service \u7684\u60C5\u51B5\u4E0B\u5B9E\u73B0 HTTPS\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.istio.io/v1alpha3
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Gateway
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> demo<span class="token punctuation">-</span>gateway
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">istio</span><span class="token punctuation">:</span> ingressgateway
  <span class="token key atrule">servers</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span>
      <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> http
      <span class="token key atrule">protocol</span><span class="token punctuation">:</span> HTTPS
    <span class="token key atrule">hosts</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> client.com
    <span class="token key atrule">tls</span><span class="token punctuation">:</span>
      <span class="token key atrule">mode</span><span class="token punctuation">:</span> SIMPLE
      <span class="token key atrule">credentialName</span><span class="token punctuation">:</span> istio<span class="token punctuation">-</span>secret
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><p>\u5176\u4E2D credentialName \u662F\u5F53\u524D\u547D\u540D\u7A7A\u95F4\u4E2D\u7684\u4E00\u4E2A Kubernetes tls secret\u3002</p><h2 id="\u5C06-grpc-\u670D\u52A1\u901A\u8FC7-istio-gateway-\u66B4\u9732" tabindex="-1"><a class="header-anchor" href="#\u5C06-grpc-\u670D\u52A1\u901A\u8FC7-istio-gateway-\u66B4\u9732" aria-hidden="true">#</a> \u5C06 gRPC \u670D\u52A1\u901A\u8FC7 Istio Gateway \u66B4\u9732</h2><p>\u9996\u5148\u90E8\u7F72\u4E00\u4E2A gRPC Service\uFF0C\u6CE8\u610F Service \u7684 spec.ports.name \u8981\u4EE5 grpc \u5F00\u5934\uFF0C\u7136\u540E\u7F16\u5199\u4E0B\u9762\u7684 Gateway \u914D\u7F6E\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.istio.io/v1alpha3
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Gateway
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> demo<span class="token punctuation">-</span>gateway
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">istio</span><span class="token punctuation">:</span> ingressgateway
  <span class="token key atrule">servers</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span>
      <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">443</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> grpc
      <span class="token key atrule">protocol</span><span class="token punctuation">:</span> GRPC
    <span class="token key atrule">hosts</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> server.com
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>\u7136\u540E\u540C\u6837\u521B\u5EFA VirtualService \u5E76\u7ED1\u5B9A\u8FD9\u4E2A Gateway\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.istio.io/v1alpha3
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VirtualService
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> vs<span class="token punctuation">-</span>demo2
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">hosts</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> server.com
  <span class="token key atrule">gateways</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> demo<span class="token punctuation">-</span>gateway
  <span class="token key atrule">http</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">route</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">destination</span><span class="token punctuation">:</span>
        <span class="token key atrule">host</span><span class="token punctuation">:</span> grpc<span class="token punctuation">-</span>server<span class="token punctuation">-</span>service
        <span class="token key atrule">port</span><span class="token punctuation">:</span>
          <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">8000</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> grpc<span class="token punctuation">-</span>demo
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p>\u6B64\u65F6\u5373\u53EF\u4F7F\u7528\u5BA2\u6237\u7AEF\u8FDB\u884C\u8BBF\u95EE\u3002</p><p>\u4FEE\u6539 Gateway \u6587\u4EF6\u5B9E\u73B0 gRPC over TLS\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.istio.io/v1alpha3
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Gateway
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> demo<span class="token punctuation">-</span>gateway
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">istio</span><span class="token punctuation">:</span> ingressgateway
  <span class="token key atrule">servers</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span>
      <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">443</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> grpc
      <span class="token key atrule">protocol</span><span class="token punctuation">:</span> HTTPS
    <span class="token key atrule">tls</span><span class="token punctuation">:</span>
      <span class="token key atrule">mode</span><span class="token punctuation">:</span> SIMPLE
      <span class="token key atrule">credentialName</span><span class="token punctuation">:</span> grpc<span class="token punctuation">-</span>secret
    <span class="token key atrule">hosts</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> server.com
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><p>\u534F\u8BAE\u6539\u4E3A HTTPS\u3002</p>`,18);function g(h,v){const a=p("ExternalLinkIcon");return t(),l(u,null,[i,n("p",null,[k,n("a",b,[m,c(a)]),y]),d],64)}var _=e(r,[["render",g],["__file","examples.html.vue"]]);export{_ as default};
