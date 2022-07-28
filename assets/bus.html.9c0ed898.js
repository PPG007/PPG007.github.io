import{_ as n,e as s}from"./app.49cd7b53.js";const a={},p=s(`<h1 id="bus\u6D88\u606F\u603B\u7EBF" tabindex="-1"><a class="header-anchor" href="#bus\u6D88\u606F\u603B\u7EBF" aria-hidden="true">#</a> BUS\u6D88\u606F\u603B\u7EBF</h1><p>Spring Cloud BUS \u652F\u6301 RabbitMQ \u548C Kafka\u3002</p><h2 id="\u5F15\u5165\u4F9D\u8D56" tabindex="-1"><a class="header-anchor" href="#\u5F15\u5165\u4F9D\u8D56" aria-hidden="true">#</a> \u5F15\u5165\u4F9D\u8D56</h2><div class="language-xml ext-xml line-numbers-mode"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-cloud-starter-bus-amqp<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="\u4FEE\u6539-config-server-\u914D\u7F6E\u6587\u4EF6" tabindex="-1"><a class="header-anchor" href="#\u4FEE\u6539-config-server-\u914D\u7F6E\u6587\u4EF6" aria-hidden="true">#</a> \u4FEE\u6539 Config Server \u914D\u7F6E\u6587\u4EF6</h2><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">profiles</span><span class="token punctuation">:</span>
    <span class="token key atrule">active</span><span class="token punctuation">:</span> prod
  <span class="token key atrule">cloud</span><span class="token punctuation">:</span>
    <span class="token key atrule">config</span><span class="token punctuation">:</span>
      <span class="token key atrule">server</span><span class="token punctuation">:</span>
        <span class="token key atrule">git</span><span class="token punctuation">:</span>
          <span class="token key atrule">uri</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//gitee.com/pidehen2/spring<span class="token punctuation">-</span>cloud<span class="token punctuation">-</span>config<span class="token punctuation">-</span>learn.git
          <span class="token comment">#          username: 1658272229@qq.com</span>
          <span class="token comment">#          skip-ssl-validation: true</span>
          <span class="token comment">#          password: 06050704zxl</span>
          <span class="token key atrule">basedir</span><span class="token punctuation">:</span> D<span class="token punctuation">:</span>//config
          <span class="token key atrule">search-paths</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> SpringCloudConfigLearn
      <span class="token key atrule">label</span><span class="token punctuation">:</span> master
  <span class="token key atrule">application</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>server
  <span class="token key atrule">rabbitmq</span><span class="token punctuation">:</span> <span class="token comment"># \u914D\u7F6ERabbitMQ\u6D88\u606F\u961F\u5217</span>
    <span class="token key atrule">host</span><span class="token punctuation">:</span> 192.168.3.14
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">5672</span>
    <span class="token key atrule">username</span><span class="token punctuation">:</span> rabbitmq
    <span class="token key atrule">password</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>spring.rabbitmq.username<span class="token punctuation">}</span>
<span class="token key atrule">eureka</span><span class="token punctuation">:</span>
  <span class="token key atrule">client</span><span class="token punctuation">:</span>
    <span class="token key atrule">service-url</span><span class="token punctuation">:</span>
      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//192.168.3.14<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//192.168.3.55<span class="token punctuation">:</span>7002/eureka/
  <span class="token key atrule">instance</span><span class="token punctuation">:</span>
    <span class="token key atrule">instance-id</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>server
    <span class="token key atrule">prefer-ip-address</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">ip-address</span><span class="token punctuation">:</span> 192.168.3.55
    <span class="token key atrule">non-secure-port</span><span class="token punctuation">:</span> <span class="token number">3344</span>
<span class="token key atrule">management</span><span class="token punctuation">:</span>
  <span class="token key atrule">endpoints</span><span class="token punctuation">:</span>
    <span class="token key atrule">web</span><span class="token punctuation">:</span>
      <span class="token key atrule">exposure</span><span class="token punctuation">:</span>
        <span class="token key atrule">include</span><span class="token punctuation">:</span> <span class="token string">&quot;*&quot;</span> <span class="token comment"># \u66B4\u9732\u51FA\u4F9B\u52A8\u6001\u5237\u65B0\u7684\u63A5\u53E3</span>
<span class="token punctuation">---</span>
<span class="token key atrule">server</span><span class="token punctuation">:</span>
  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">3344</span>
<span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">config</span><span class="token punctuation">:</span>
    <span class="token key atrule">activate</span><span class="token punctuation">:</span>
      <span class="token key atrule">on-profile</span><span class="token punctuation">:</span> prod

<span class="token punctuation">---</span>

<span class="token key atrule">server</span><span class="token punctuation">:</span>
  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8848</span>
<span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">config</span><span class="token punctuation">:</span>
    <span class="token key atrule">activate</span><span class="token punctuation">:</span>
      <span class="token key atrule">on-profile</span><span class="token punctuation">:</span> dev
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br></div></div><h2 id="\u4FEE\u6539-config-client-3355-\u7684\u914D\u7F6E\u6587\u4EF6" tabindex="-1"><a class="header-anchor" href="#\u4FEE\u6539-config-client-3355-\u7684\u914D\u7F6E\u6587\u4EF6" aria-hidden="true">#</a> \u4FEE\u6539 Config Client 3355 \u7684\u914D\u7F6E\u6587\u4EF6</h2><p>bootstrap.yml:</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">server</span><span class="token punctuation">:</span>
  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">3355</span>
<span class="token key atrule">eureka</span><span class="token punctuation">:</span>
  <span class="token key atrule">client</span><span class="token punctuation">:</span>
    <span class="token key atrule">service-url</span><span class="token punctuation">:</span>
      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//192.168.3.14<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//192.168.3.55<span class="token punctuation">:</span>7002/eureka/
  <span class="token key atrule">instance</span><span class="token punctuation">:</span>
    <span class="token key atrule">prefer-ip-address</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">ip-address</span><span class="token punctuation">:</span> 127.0.0.1
    <span class="token key atrule">non-secure-port</span><span class="token punctuation">:</span> <span class="token number">3355</span>
<span class="token key atrule">management</span><span class="token punctuation">:</span>
  <span class="token key atrule">endpoints</span><span class="token punctuation">:</span>
    <span class="token key atrule">web</span><span class="token punctuation">:</span>
      <span class="token key atrule">exposure</span><span class="token punctuation">:</span>
        <span class="token key atrule">include</span><span class="token punctuation">:</span> <span class="token string">&quot;*&quot;</span>
<span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">application</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>client
  <span class="token key atrule">rabbitmq</span><span class="token punctuation">:</span> <span class="token comment"># \u914D\u7F6ERabbitMQ</span>
    <span class="token key atrule">host</span><span class="token punctuation">:</span> 192.168.3.14
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">5672</span>
    <span class="token key atrule">username</span><span class="token punctuation">:</span> rabbitmq
    <span class="token key atrule">password</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>spring.rabbitmq.username<span class="token punctuation">}</span>
  <span class="token key atrule">cloud</span><span class="token punctuation">:</span>
    <span class="token key atrule">config</span><span class="token punctuation">:</span> <span class="token comment"># \u8BBE\u7F6EGit\u7684\u76F8\u5173\u4FE1\u606F</span>
      <span class="token key atrule">label</span><span class="token punctuation">:</span> master
      <span class="token key atrule">profile</span><span class="token punctuation">:</span> prod
      <span class="token key atrule">discovery</span><span class="token punctuation">:</span>
        <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>

        <span class="token key atrule">service-id</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>server
      <span class="token key atrule">name</span><span class="token punctuation">:</span> config <span class="token comment"># \u5982\u679C\u4E0D\u662F\u540D\u5B57\u4E3Aapplication\u9700\u8981\u6307\u5B9A</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br></div></div><h2 id="\u4FEE\u6539-config-client-3366-\u914D\u7F6E\u6587\u4EF6" tabindex="-1"><a class="header-anchor" href="#\u4FEE\u6539-config-client-3366-\u914D\u7F6E\u6587\u4EF6" aria-hidden="true">#</a> \u4FEE\u6539 Config Client 3366 \u914D\u7F6E\u6587\u4EF6</h2><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">server</span><span class="token punctuation">:</span>
  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">3366</span>
<span class="token key atrule">eureka</span><span class="token punctuation">:</span>
  <span class="token key atrule">client</span><span class="token punctuation">:</span>
    <span class="token key atrule">service-url</span><span class="token punctuation">:</span>
      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//192.168.3.14<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//192.168.3.55<span class="token punctuation">:</span>7002/eureka/
  <span class="token key atrule">instance</span><span class="token punctuation">:</span>
    <span class="token key atrule">prefer-ip-address</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">ip-address</span><span class="token punctuation">:</span> 127.0.0.1
    <span class="token key atrule">non-secure-port</span><span class="token punctuation">:</span> <span class="token number">3366</span>
<span class="token key atrule">management</span><span class="token punctuation">:</span>
  <span class="token key atrule">endpoints</span><span class="token punctuation">:</span>
    <span class="token key atrule">web</span><span class="token punctuation">:</span>
      <span class="token key atrule">exposure</span><span class="token punctuation">:</span>
        <span class="token key atrule">include</span><span class="token punctuation">:</span> <span class="token string">&quot;*&quot;</span>
<span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">application</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>client
  <span class="token key atrule">rabbitmq</span><span class="token punctuation">:</span>
    <span class="token key atrule">host</span><span class="token punctuation">:</span> 192.168.3.14
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">5672</span>
    <span class="token key atrule">username</span><span class="token punctuation">:</span> rabbitmq
    <span class="token key atrule">password</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>spring.rabbitmq.username<span class="token punctuation">}</span>
  <span class="token key atrule">cloud</span><span class="token punctuation">:</span>
    <span class="token key atrule">config</span><span class="token punctuation">:</span>
      <span class="token key atrule">label</span><span class="token punctuation">:</span> master
      <span class="token key atrule">profile</span><span class="token punctuation">:</span> dev
      <span class="token key atrule">discovery</span><span class="token punctuation">:</span>
        <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>

        <span class="token key atrule">service-id</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>server
      <span class="token key atrule">name</span><span class="token punctuation">:</span> config
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br></div></div><h2 id="\u83B7\u53D6\u52A8\u6001\u5237\u65B0\u7684\u63A5\u53E3" tabindex="-1"><a class="header-anchor" href="#\u83B7\u53D6\u52A8\u6001\u5237\u65B0\u7684\u63A5\u53E3" aria-hidden="true">#</a> \u83B7\u53D6\u52A8\u6001\u5237\u65B0\u7684\u63A5\u53E3</h2><p>\u8BBF\u95EE <code>http://192.168.3.55:3344/actuator/</code>\uFF0C\u627E\u5230\u5237\u65B0\u7684 url\u3002</p><p>\u9ED8\u8BA4\u60C5\u51B5\u4E0B\uFF0C<code>http://192.168.3.55:3344/actuator/busrefresh/</code> \u5C31\u662F\u52A8\u6001\u5237\u65B0\u7684\u63A5\u53E3\uFF0C\u4F7F\u7528 POST \u65B9\u5F0F\u8BBF\u95EE\u5373\u53EF\u3002</p><h2 id="\u53EA\u5237\u65B0\u67D0\u4E2A-client" tabindex="-1"><a class="header-anchor" href="#\u53EA\u5237\u65B0\u67D0\u4E2A-client" aria-hidden="true">#</a> \u53EA\u5237\u65B0\u67D0\u4E2A Client</h2><p>\u8BBF\u95EE <code>http://192.168.3.55:3344/actuator/busrefresh/config-client:3366</code></p><p>\u5728\u5168\u4F53\u901A\u77E5\u63A5\u53E3\u540E\u52A0\u4E0A\u670D\u52A1\u540D:\u7AEF\u53E3\u53F7\u5373\u53EF\u3002</p>`,17);function e(t,l){return p}var u=n(a,[["render",e],["__file","bus.html.vue"]]);export{u as default};
