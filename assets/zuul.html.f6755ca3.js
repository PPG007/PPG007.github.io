import{_ as e,r as t,o as c,c as l,a as n,d as o,F as u,e as s,b as a}from"./app.49cd7b53.js";const r={},i=s(`<h1 id="zuul" tabindex="-1"><a class="header-anchor" href="#zuul" aria-hidden="true">#</a> Zuul</h1><h2 id="\u76F8\u5173\u4F9D\u8D56" tabindex="-1"><a class="header-anchor" href="#\u76F8\u5173\u4F9D\u8D56" aria-hidden="true">#</a> \u76F8\u5173\u4F9D\u8D56</h2><div class="language-xml ext-xml line-numbers-mode"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-cloud-starter-netflix-zuul<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-cloud-starter-netflix-eureka-client<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-boot-starter-actuator<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h2 id="\u4F7F\u7528-zuul" tabindex="-1"><a class="header-anchor" href="#\u4F7F\u7528-zuul" aria-hidden="true">#</a> \u4F7F\u7528 Zuul</h2><h3 id="\u5F00\u542F-zuul-\u652F\u6301" tabindex="-1"><a class="header-anchor" href="#\u5F00\u542F-zuul-\u652F\u6301" aria-hidden="true">#</a> \u5F00\u542F Zuul \u652F\u6301</h3><p>\u5728\u4E3B\u542F\u52A8\u7C7B\u4E0A\u6DFB\u52A0 <code>@EnableZuulProxy</code> \u6CE8\u89E3\u3002</p><h3 id="\u914D\u7F6E-zuul" tabindex="-1"><a class="header-anchor" href="#\u914D\u7F6E-zuul" aria-hidden="true">#</a> \u914D\u7F6E Zuul</h3><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">server</span><span class="token punctuation">:</span>
  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">9527</span>
<span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">application</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> Zuul
<span class="token key atrule">eureka</span><span class="token punctuation">:</span>
  <span class="token key atrule">client</span><span class="token punctuation">:</span>
    <span class="token key atrule">service-url</span><span class="token punctuation">:</span>
      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//localhost<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//localhost2<span class="token punctuation">:</span>7002/eureka/
  <span class="token key atrule">instance</span><span class="token punctuation">:</span>
    <span class="token key atrule">instance-id</span><span class="token punctuation">:</span> Zuul
    <span class="token key atrule">prefer-ip-address</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">info</span><span class="token punctuation">:</span>
  <span class="token key atrule">app.name</span><span class="token punctuation">:</span> PPG<span class="token punctuation">-</span>SpringCloud<span class="token punctuation">-</span>Learn<span class="token punctuation">-</span>Zuul
<span class="token key atrule">zuul</span><span class="token punctuation">:</span>
  <span class="token key atrule">routes</span><span class="token punctuation">:</span>
    <span class="token key atrule">springcloud-provider-dept</span><span class="token punctuation">:</span> /dept/<span class="token important">**</span> <span class="token comment">#\u4E3A\u670D\u52A1\u6307\u5B9AURl</span>
  <span class="token key atrule">ignored-services</span><span class="token punctuation">:</span> <span class="token string">&#39;*&#39;</span>
 <span class="token key atrule">prefix</span><span class="token punctuation">:</span> /dept
  <span class="token key atrule">host</span><span class="token punctuation">:</span>
    <span class="token key atrule">connect-timeout-millis</span><span class="token punctuation">:</span> <span class="token number">2000</span>
    <span class="token key atrule">socket-timeout-millis</span><span class="token punctuation">:</span> <span class="token number">10000</span>
  <span class="token key atrule">strip-prefix</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token comment">#\u8BBE\u7F6E\u662F\u5426\u8DF3\u8FC7\u524D\u7F00\uFF0C\u8FD9\u91CC\u662F\u5168\u5C40\u914D\u7F6E\uFF0C\u65E2\u5F71\u54CDprefix\u4E5F\u5F71\u54CD\u7ED9\u670D\u52A1\u6307\u5B9A\u7684url\u524D\u7F00\uFF0C</span>
  <span class="token comment"># \u9ED8\u8BA4\u4E3Atrue\uFF0C\u4EE5\u6B64\u5904\u4E3A\u4F8B\uFF0C\u82E5\u8BBE\u7F6E\u4E3Atrue\uFF0C\u5219\u8BBF\u95EE\u65F6\u8F93\u5165</span>
  <span class="token comment"># localhost:9527/dept/dept/dept/queryAll\u624D\u53EF\u4EE5\u6B63\u5E38\u8BBF\u95EE\uFF0C</span>
  <span class="token comment"># \u7B2C\u4E00\u4E2Adept\u662Fprifix\uFF0C\u7B2C\u4E8C\u4E2A\u662F\u4E3A\u670D\u52A1\u6307\u5B9A\u7684\u524D\u7F00\uFF0C\u7B2C\u4E09\u4E2A\u662F\u5FAE\u670D\u52A1\u5185\u90E8\u7684\u524D\u7F00\uFF0C</span>
  <span class="token comment"># \u7531\u4E8E\u8BBE\u7F6E\u4E3Atrue\uFF0C\u5219\u8FD9\u4E2A\u8BF7\u6C42\u7684url\u88AB\u8F6C\u6362\u4E3Alocalhost:8001/dept/queryAll\uFF0C</span>
  <span class="token comment"># \u4E5F\u5C31\u662F\u5FFD\u7565\u4E86\u4E24\u4E2Aprefix\u4F46\u5FAE\u670D\u52A1\u5185\u90E8\u524D\u7F00\u4F9D\u7136\u4FDD\u7559</span>
  <span class="token comment"># strip-prefix\u4E5F\u53EF\u4EE5\u4E3A\u6307\u5B9A\u7684\u5FAE\u670D\u52A1\u8BBE\u7F6E\uFF0C\u4F8B\u5982\uFF1A</span>
  <span class="token comment"># routes:</span>
  <span class="token comment">#   springcloud-provider-dept:</span>
  <span class="token comment">#   path: /dept/**</span>
  <span class="token comment">#   strip-prefix: false</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br></div></div><h2 id="zuul-\u4E0E-ribbon-\u548C-hystrix" tabindex="-1"><a class="header-anchor" href="#zuul-\u4E0E-ribbon-\u548C-hystrix" aria-hidden="true">#</a> Zuul \u4E0E Ribbon \u548C Hystrix</h2><p>Zuul \u9ED8\u8BA4\u4F7F\u7528 Ribbon \u548C Hystrix\uFF0C\u4E3A\u4E86\u9632\u6B62\u8BBF\u95EE\u8D85\u65F6\uFF0C\u505A\u5982\u4E0B\u914D\u7F6E\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">hystrix</span><span class="token punctuation">:</span>
  <span class="token key atrule">command</span><span class="token punctuation">:</span>
    <span class="token key atrule">default</span><span class="token punctuation">:</span>
      <span class="token key atrule">execution</span><span class="token punctuation">:</span>
        <span class="token key atrule">isolation</span><span class="token punctuation">:</span>
          <span class="token key atrule">thread</span><span class="token punctuation">:</span>
            <span class="token key atrule">timeoutInMilliseconds</span><span class="token punctuation">:</span> <span class="token number">60000</span>
<span class="token key atrule">ribbon</span><span class="token punctuation">:</span>
  <span class="token key atrule">ConnectTimeout</span><span class="token punctuation">:</span> <span class="token number">3000</span>
  <span class="token key atrule">ReadTimeout</span><span class="token punctuation">:</span> <span class="token number">60000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>\u53EF\u4EE5\u81EA\u5B9A\u4E49\u914D\u7F6E Ribbon \u7684\u7B56\u7565\uFF1A</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@Bean</span>
<span class="token keyword">public</span> <span class="token class-name">IRule</span> <span class="token function">iRule</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">RandomRule</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>\u5B9E\u73B0\u670D\u52A1\u964D\u7EA7\uFF1A</p><p>Zuul \u7F51\u5173\u4E2D\u5B9E\u73B0\u670D\u52A1\u964D\u7EA7\uFF0C\u53EA\u9700\u8981\u5728 Zuul \u7F51\u5173\u7684\u670D\u52A1\u4E2D\uFF0C\u7F16\u5199\u5B9E\u73B0 <code>ZuulFallbackProvider</code> \u63A5\u53E3\u7684 java \u7C7B\u5373\u53EF\uFF1A</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ProductFallback</span> <span class="token keyword">implements</span> <span class="token class-name">ZuulFallbackProvider</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     * \u6307\u5B9A\u9700\u8981\u6258\u5E95\u5904\u7406\u7684\u670D\u52A1\u540D
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getRoute</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token string">&quot;e-book-product-provider&quot;</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * \u670D\u52A1\u65E0\u6CD5\u4F7F\u7528\u65F6\uFF0C\u8FD4\u56DE\u7684\u6258\u5E95\u4FE1\u606F
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">ClientHttpResponse</span> <span class="token function">fallbackResponse</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ClientHttpResponse</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token doc-comment comment">/**
             * ClientHttpResponse \u7684 fallback \u7684\u72B6\u6001\u7801 \u8FD4\u56DEHttpStatus
             */</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token class-name">HttpStatus</span> <span class="token function">getStatusCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> <span class="token class-name">HttpStatus</span><span class="token punctuation">.</span>OK<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token doc-comment comment">/**
             * ClientHttpResponse \u7684 fallback \u7684\u72B6\u6001\u7801 \u8FD4\u56DE int
             */</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">getRawStatusCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> <span class="token function">getStatusCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>

            <span class="token doc-comment comment">/**
             * ClientHttpResponse \u7684 fallback \u7684\u72B6\u6001\u7801 \u8FD4\u56DE String
             */</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getStatusText</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> <span class="token function">getStatusCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getReasonPhrase</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>


            <span class="token doc-comment comment">/**
             * \u8BBE\u7F6E\u54CD\u5E94\u4F53
             */</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token class-name">InputStream</span> <span class="token function">getBody</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span>
                <span class="token class-name">String</span> msg <span class="token operator">=</span> <span class="token string">&quot;\u5F53\u524D\u670D\u52A1\u4E0D\u53EF\u7528\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5&quot;</span><span class="token punctuation">;</span>
                <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ByteArrayInputStream</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token doc-comment comment">/**
             * \u8BBE\u7F6E\u54CD\u5E94\u7684\u5934\u4FE1\u606F
             */</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token class-name">HttpHeaders</span> <span class="token function">getHeaders</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">HttpHeaders</span> httpHeaders<span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HttpHeaders</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">MediaType</span> mediaType <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MediaType</span><span class="token punctuation">(</span><span class="token string">&quot;application&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;json&quot;</span><span class="token punctuation">,</span> <span class="token class-name">Charset</span><span class="token punctuation">.</span><span class="token function">forName</span><span class="token punctuation">(</span><span class="token string">&quot;utf-8&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                httpHeaders<span class="token punctuation">.</span><span class="token function">setContentType</span><span class="token punctuation">(</span>mediaType<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">return</span> httpHeaders<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>

            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br></div></div><div class="custom-container warning"><p class="custom-container-title">\u6CE8\u610F</p><p>\u5F53\u524D\u8FDB\u884C\u670D\u52A1\u964D\u7EA7\u7684\u670D\u52A1\uFF0C\u5728\u6CE8\u518C\u4E2D\u5FC3\u5FC5\u987B\u5B58\u5728\uFF0C\u5426\u5219\uFF0C\u4F1A\u76F4\u63A5\u51FA 404,No message available \u9519\u8BEF\uFF0C\u4E0D\u4F1A\u8FDB\u884C\u964D\u7EA7\u3002</p></div><h2 id="zuul-\u8FC7\u6EE4\u5668" tabindex="-1"><a class="header-anchor" href="#zuul-\u8FC7\u6EE4\u5668" aria-hidden="true">#</a> Zuul \u8FC7\u6EE4\u5668</h2>`,18),k={href:"https://www.jianshu.com/p/ff863d532767",target:"_blank",rel:"noopener noreferrer"},b=a("\u8FC7\u6EE4\u5668"),m=a("\u3002"),d=s(`<p>\u4F8B\u5B50\uFF1A</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">LoginFilter</span> <span class="token keyword">extends</span> <span class="token class-name">ZuulFilter</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     * \u8FC7\u6EE4\u5668\u7C7B\u578B\uFF0C\u524D\u7F6E\u8FC7\u6EE4\u5668
     * <span class="token keyword">@return</span>
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">filterType</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token string">&quot;pre&quot;</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * \u8FC7\u6EE4\u5668\u7684\u6267\u884C\u987A\u5E8F
     * <span class="token keyword">@return</span>
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">filterOrder</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * \u8BE5\u8FC7\u6EE4\u5668\u662F\u5426\u751F\u6548
     * <span class="token keyword">@return</span>
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">shouldFilter</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * \u767B\u9646\u6821\u9A8C\u903B\u8F91
     * <span class="token keyword">@return</span>
     * <span class="token keyword">@throws</span> <span class="token reference"><span class="token class-name">ZuulException</span></span>
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">Object</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">ZuulException</span> <span class="token punctuation">{</span>
        <span class="token comment">// \u83B7\u53D6zuul\u63D0\u4F9B\u7684\u4E0A\u4E0B\u6587\u5BF9\u8C61</span>
        <span class="token class-name">RequestContext</span> context <span class="token operator">=</span> <span class="token class-name">RequestContext</span><span class="token punctuation">.</span><span class="token function">getCurrentContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// \u4ECE\u4E0A\u4E0B\u6587\u5BF9\u8C61\u4E2D\u83B7\u53D6\u8BF7\u6C42\u5BF9\u8C61</span>
        <span class="token class-name">HttpServletRequest</span> request <span class="token operator">=</span> context<span class="token punctuation">.</span><span class="token function">getRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// \u83B7\u53D6token\u4FE1\u606F</span>
        <span class="token class-name">String</span> token <span class="token operator">=</span> request<span class="token punctuation">.</span><span class="token function">getParameter</span><span class="token punctuation">(</span><span class="token string">&quot;access-token&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// \u5224\u65AD</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isBlank</span><span class="token punctuation">(</span>token<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// \u8FC7\u6EE4\u8BE5\u8BF7\u6C42\uFF0C\u4E0D\u5BF9\u5176\u8FDB\u884C\u8DEF\u7531</span>
            context<span class="token punctuation">.</span><span class="token function">setSendZuulResponse</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// \u8BBE\u7F6E\u54CD\u5E94\u72B6\u6001\u7801\uFF0C401</span>
            context<span class="token punctuation">.</span><span class="token function">setResponseStatusCode</span><span class="token punctuation">(</span><span class="token class-name">HttpStatus</span><span class="token punctuation">.</span>SC_UNAUTHORIZED<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// \u8BBE\u7F6E\u54CD\u5E94\u4FE1\u606F</span>
            context<span class="token punctuation">.</span><span class="token function">setResponseBody</span><span class="token punctuation">(</span><span class="token string">&quot;{\\&quot;status\\&quot;:\\&quot;401\\&quot;, \\&quot;text\\&quot;:\\&quot;request error!\\&quot;}&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// \u6821\u9A8C\u901A\u8FC7\uFF0C\u628A\u767B\u9646\u4FE1\u606F\u653E\u5165\u4E0A\u4E0B\u6587\u4FE1\u606F\uFF0C\u7EE7\u7EED\u5411\u540E\u6267\u884C</span>
        context<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">&quot;token&quot;</span><span class="token punctuation">,</span> token<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br></div></div>`,2);function g(y,h){const p=t("ExternalLinkIcon");return c(),l(u,null,[i,n("p",null,[n("a",k,[b,o(p)]),m]),d],64)}var w=e(r,[["render",g],["__file","zuul.html.vue"]]);export{w as default};
