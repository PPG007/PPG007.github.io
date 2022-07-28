import{_ as n,e as s}from"./app.49cd7b53.js";const a={},e=s(`<h1 id="statefulset" tabindex="-1"><a class="header-anchor" href="#statefulset" aria-hidden="true">#</a> StatefulSet</h1><p>StatefulSet \u662F\u6709\u72B6\u6001\u7684\u96C6\u5408\uFF0C\u7BA1\u7406\u6709\u72B6\u6001\u7684\u670D\u52A1\uFF0C\u6240\u7BA1\u7406\u7684 Pod \u540D\u79F0\u4E0D\u80FD\u968F\u610F\u53D8\u5316\uFF0C\u6570\u636E\u6301\u4E45\u5316\u7684\u76EE\u5F55\u4E5F\u4E0D\u4E00\u6837\uFF0C\u6BCF\u4E00\u4E2A Pod \u90FD\u6709\u81EA\u5DF1\u7684\u6570\u636E\u6301\u4E45\u5316\u5B58\u50A8\u76EE\u5F55\uFF0C\u6BD4\u5982\u6570\u636E\u5E93\u96C6\u7FA4\u3001Redis \u96C6\u7FA4\u7B49\u573A\u666F\u3002</p><p>\u4E0B\u9762\u521B\u5EFA\u4E00\u4E2A\u793A\u4F8B StatefulSet\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> web
  <span class="token key atrule">clusterIP</span><span class="token punctuation">:</span> None
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx
<span class="token punctuation">---</span>
<span class="token comment"># \u901A\u8FC7\u4E0B\u9762\u8FD9\u4E2A service \u8BBF\u95EE\u4E0A\u9762\u8FD9\u4E2A Headle \u670D\u52A1</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>visit
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> web
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> StatefulSet
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> web
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx <span class="token comment"># has to match .spec.template.metadata.labels</span>
  <span class="token key atrule">serviceName</span><span class="token punctuation">:</span> <span class="token string">&quot;nginx&quot;</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span> <span class="token comment"># by default is 1</span>
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> nginx <span class="token comment"># has to match .spec.selector.matchLabels</span>
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">terminationGracePeriodSeconds</span><span class="token punctuation">:</span> <span class="token number">10</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx
        <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> web
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> www
          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /usr/share/nginx/html
  <span class="token key atrule">volumeClaimTemplates</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> www
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">accessModes</span><span class="token punctuation">:</span> <span class="token punctuation">[</span> <span class="token string">&quot;ReadWriteMany&quot;</span> <span class="token punctuation">]</span>
      <span class="token key atrule">storageClassName</span><span class="token punctuation">:</span> <span class="token string">&quot;nfs-client&quot;</span>
      <span class="token key atrule">resources</span><span class="token punctuation">:</span>
        <span class="token key atrule">requests</span><span class="token punctuation">:</span>
          <span class="token key atrule">storage</span><span class="token punctuation">:</span> 10Mi
<span class="token punctuation">---</span>
<span class="token comment"># \u901A\u8FC7 Ingress \u66B4\u9732\u670D\u52A1</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> statefulset<span class="token punctuation">-</span>demo
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> example
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">nginx.ingress.kubernetes.io/rewrite-target</span><span class="token punctuation">:</span> /$1
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ingressClassName</span><span class="token punctuation">:</span> nginx
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> client.com
      <span class="token key atrule">http</span><span class="token punctuation">:</span>
        <span class="token key atrule">paths</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">path</span><span class="token punctuation">:</span> /wuhu(/<span class="token punctuation">|</span>$)(.<span class="token important">*)</span>
            <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
            <span class="token key atrule">backend</span><span class="token punctuation">:</span>
              <span class="token key atrule">service</span><span class="token punctuation">:</span>
                <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx<span class="token punctuation">-</span>visit
                <span class="token key atrule">port</span><span class="token punctuation">:</span>
                  <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">80</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br></div></div><p>\u6301\u4E45\u5377\u7533\u660E PVC \u6211\u4EEC\u4F7F\u7528\u4E4B\u524D\u7684 nfs \u5B58\u50A8\u5206\u914D\u5668\u5206\u914D\uFF0C\u7136\u540E\u5728\u6267\u884C\u8FD9\u4E2A\u914D\u7F6E\u6587\u4EF6\u540E\uFF0C\u67E5\u770B nfs \u7684\u76EE\u5F55\uFF0C\u53EF\u4EE5\u770B\u5230\u6709 replicas \u4E2A\u76EE\u5F55\uFF0C\u6BCF\u4E00\u4E2A\u5C31\u5BF9\u5E94\u4E00\u4E2A Pod \u7684\u6301\u4E45\u5377\u3002</p><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p>StatefulSet \u5F53\u524D\u9700\u8981\u65E0\u5934\u670D\u52A1\u6765\u8D1F\u8D23 Pod \u7684\u7F51\u7EDC\u6807\u8BC6\uFF0C\u4E5F\u5C31\u662F\u9700\u8981\u4E00\u4E2A clusterIP \u4E3A None \u7684 Service\u3002</p></div>`,6);function p(t,l){return e}var u=n(a,[["render",p],["__file","statefulSet.html.vue"]]);export{u as default};
