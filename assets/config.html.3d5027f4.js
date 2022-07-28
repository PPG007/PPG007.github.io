import{_ as n,e as s}from"./app.49cd7b53.js";var a="/Redis/RedisConfig-include.jpg",e="/Redis/RedisConfig-maxclients.jpg";const p={},l=s('<h1 id="redis-config-\u6587\u4EF6\u89E3\u6790" tabindex="-1"><a class="header-anchor" href="#redis-config-\u6587\u4EF6\u89E3\u6790" aria-hidden="true">#</a> Redis Config \u6587\u4EF6\u89E3\u6790</h1><p>\u5305\u542B\u5176\u4ED6\u914D\u7F6E\u6587\u4EF6\uFF1A</p><p><img src="'+a+`" alt="include"></p><p>\u7F51\u7EDC\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment">################################## NETWORK #####################################</span>
<span class="token comment"># Examples:</span>
<span class="token comment"># bind 192.168.1.100 10.0.0.1     # listens on two specific IPv4 addresses</span>
<span class="token comment"># bind 127.0.0.1 ::1              # listens on loopback IPv4 and IPv6</span>
<span class="token comment"># bind * -::*                     # like the default, all available interfaces</span>

<span class="token comment"># \u7ED1\u5B9Aip\uFF0C\u53EA\u6709\u88AB\u7ED1\u5B9A\u7684ip\u5730\u5740\u624D\u80FD\u8BBF\u95EE</span>
<span class="token comment">#bind 127.0.0.1 -::1</span>

<span class="token comment"># \u4FDD\u62A4\u6A21\u5F0F\uFF0C\u9ED8\u8BA4\u5F00\u542F</span>
protected-mode no

<span class="token comment"># \u7AEF\u53E3\u8BBE\u7F6E</span>
port <span class="token number">6379</span>

tcp-backlog <span class="token number">511</span>

<span class="token comment"># \u8D85\u65F6</span>
<span class="token function">timeout</span> <span class="token number">0</span>

tcp-keepalive <span class="token number">300</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br></div></div><p>\u901A\u7528\u8BBE\u7F6E\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># \u9ED8\u8BA4\u60C5\u51B5\u4E0B\uFF0Credis\u4E0D\u662F\u5728\u540E\u53F0\u8FD0\u884C\u7684\uFF0C\u5982\u679C\u9700\u8981\u5728\u540E\u53F0\u8FD0\u884C\uFF0C\u628A\u8BE5\u9879\u7684\u503C\u66F4\u6539\u4E3Ayes</span>
daemonize <span class="token function">yes</span>
<span class="token comment"># \u5F53\u8FD0\u884C\u591A\u4E2Aredis\u670D\u52A1\u65F6\uFF0C\u9700\u8981\u6307\u5B9A\u4E0D\u540C\u7684pid\u6587\u4EF6\u548C\u7AEF\u53E3</span>
pidfile /var/run/redis_6379.pid

<span class="token comment"># \u6307\u5B9A\u65E5\u5FD7\u8BB0\u5F55\u7EA7\u522B</span>
<span class="token comment"># Redis\u603B\u5171\u652F\u6301\u56DB\u4E2A\u7EA7\u522B\uFF1Adebug\u3001verbose\u3001notice\u3001warning</span>
loglevel notice
<span class="token comment"># \u914D\u7F6Elog\u6587\u4EF6\u5730\u5740</span>
<span class="token comment"># \u82E5\u4E3A\u7A7A\u503C\uFF0C\u5219\u662Fstdout\uFF0C\u6807\u51C6\u8F93\u51FA</span>
logfile <span class="token string">&quot;&quot;</span>

<span class="token comment"># \u6307\u5B9A\u53EF\u7528\u6570\u636E\u5E93\u6570\u91CF</span>
databases <span class="token number">16</span>

always-show-logo no

set-proc-title <span class="token function">yes</span>

proc-title-template <span class="token string">&quot;{title} {listen-addr} {server-mode}&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><p>\u5FEB\u7167\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># Save the DB to disk.</span>
<span class="token comment"># save &lt;seconds&gt; &lt;changes&gt;</span>
save <span class="token number">3600</span> <span class="token number">1</span>
save <span class="token number">300</span> <span class="token number">100</span>
save <span class="token number">60</span> <span class="token number">10000</span>

<span class="token comment"># \u6301\u4E45\u5316\u51FA\u9519\u662F\u5426\u7EE7\u7EED\u5DE5\u4F5C</span>
stop-writes-on-bgsave-error <span class="token function">yes</span>

<span class="token comment"># \u662F\u5426\u538B\u7F29rdb\u6587\u4EF6</span>
rdbcompression <span class="token function">yes</span>

<span class="token comment"># \u4FDD\u5B58rdb\u65F6\uFF0C\u8FDB\u884C\u9519\u8BEF\u6821\u9A8C</span>
rdbchecksum <span class="token function">yes</span>

<span class="token comment"># \u672C\u5730\u6301\u4E45\u5316\u6570\u636E\u5E93\u6587\u4EF6\u540D</span>
dbfilename dump.rdb

rdb-del-sync-files no
<span class="token comment"># \u5DE5\u4F5C\u76EE\u5F55</span>
<span class="token comment"># \u6570\u636E\u5E93\u955C\u50CF\u5907\u4EFD\u7684\u6587\u4EF6\u653E\u7F6E\u7684\u8DEF\u5F84\u3002</span>
<span class="token comment"># \u8FD9\u91CC\u7684\u8DEF\u5F84\u8DDF\u6587\u4EF6\u540D\u8981\u5206\u5F00\u914D\u7F6E\u662F\u56E0\u4E3Aredis\u5728\u8FDB\u884C\u5907\u4EFD\u65F6\uFF0C</span>
<span class="token comment"># \u5148\u4F1A\u5C06\u5F53\u524D\u6570\u636E\u5E93\u7684\u72B6\u6001\u5199\u5165\u5230\u4E00\u4E2A\u4E34\u65F6\u6587\u4EF6\u4E2D\uFF0C</span>
<span class="token comment"># \u7B49\u5907\u4EFD\u5B8C\u6210\u65F6\uFF0C\u518D\u628A\u8BE5\u8BE5\u4E34\u65F6\u6587\u4EF6\u66FF\u6362\u4E3A\u4E0A\u9762\u6240\u6307\u5B9A\u7684\u6587\u4EF6\uFF0C</span>
<span class="token comment"># \u800C\u8FD9\u91CC\u7684\u4E34\u65F6\u6587\u4EF6\u548C\u4E0A\u9762\u6240\u914D\u7F6E\u7684\u5907\u4EFD\u6587\u4EF6\u90FD\u4F1A\u653E\u5728\u8FD9\u4E2A\u6307\u5B9A\u7684\u8DEF\u5F84\u5F53\u4E2D\u3002</span>
<span class="token comment"># AOF\u6587\u4EF6\u4E5F\u4F1A\u5B58\u653E\u5728\u8FD9\u4E2A\u76EE\u5F55\u4E0B\u9762</span>
<span class="token comment"># \u6CE8\u610F\u8FD9\u91CC\u5FC5\u987B\u5236\u5B9A\u4E00\u4E2A\u76EE\u5F55\u800C\u4E0D\u662F\u6587\u4EF6</span>
<span class="token function">dir</span> ./
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br></div></div><p>\u590D\u5236\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment">#   +------------------+      +---------------+</span>
<span class="token comment">#   |      Master      | ---&gt; |    Replica    |</span>
<span class="token comment">#   | (receive writes) |      |  (exact copy) |</span>
<span class="token comment">#   +------------------+      +---------------+</span>

replica-serve-stale-data <span class="token function">yes</span>

replica-read-only <span class="token function">yes</span>

repl-diskless-sync no

repl-diskless-sync-delay <span class="token number">5</span>

repl-diskless-load disabled

repl-disable-tcp-nodelay no

replica-priority <span class="token number">100</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><p>\u5B89\u5168\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>acllog-max-len <span class="token number">128</span>

<span class="token comment"># \u8BBE\u7F6E\u5BC6\u7801</span>
requirepass <span class="token number">123456</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>\u9650\u5236\uFF1A</p><p>\u5BA2\u6237\u7AEF\u9650\u5236\uFF1A</p><p><img src="`+e+`" alt="\u9650\u5236\u5BA2\u6237\u7AEF\u6570\u91CF"></p><p>\u5185\u5B58\u9650\u5236\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># \u5185\u5B58\u6700\u5927\u503C</span>
<span class="token comment"># maxmemory &lt;bytes&gt;</span>

<span class="token comment"># \u5185\u5B58\u6EE1\u540E\u7684\u64CD\u4F5C</span>
<span class="token comment"># maxmemory-policy noeviction</span>

<span class="token comment"># \u51718\u79CD\u9009\u62E9</span>
<span class="token comment"># volatile-lru \u5BF9\u8BBE\u7F6E\u4E86\u8FC7\u671F\u65F6\u95F4\u7684key\u4F7F\u7528LRU\u7B97\u6CD5</span>
<span class="token comment"># allkeys-lru \u6240\u6709key\u90FD\u4F7F\u7528LRU\u7B97\u6CD5</span>
<span class="token comment"># volatile-lfu \u5BF9\u8BBE\u7F6E\u4E86\u8FC7\u671F\u65F6\u95F4\u7684key\u4F7F\u7528LFU\u7B97\u6CD5</span>
<span class="token comment"># allkeys-lfu \u6240\u6709key\u90FD\u4F7F\u7528LFU\u7B97\u6CD5</span>
<span class="token comment"># volatile-random \u5BF9\u8BBE\u7F6E\u4E86\u8FC7\u671F\u65F6\u95F4\u7684key\u968F\u673A\u79FB\u9664</span>
<span class="token comment"># allkeys-random \u6240\u6709key\u90FD\u4F1A\u88AB\u968F\u673A\u79FB\u9664</span>
<span class="token comment"># volatile-ttl \u5220\u9664\u5373\u5C06\u8FC7\u671F\u7684</span>
<span class="token comment"># noeviction \u6C38\u4E0D\u8FC7\u671F\uFF0C\u8FD4\u56DE\u9519\u8BEF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>Append Only \u6A21\u5F0F(AOF)\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># \u662F\u5426\u5F00\u542FAOF\uFF0C\u9ED8\u8BA4\u5173\u95ED\uFF0C\u4F7F\u7528RDB</span>
appendonly no

<span class="token comment"># \u6301\u4E45\u5316\u6587\u4EF6\u540D</span>
appendfilename <span class="token string">&quot;appendonly.aof&quot;</span>

<span class="token comment"># \u9ED8\u8BA4\u6BCF\u79D2\u90FD\u540C\u6B65</span>
appendfsync everysec
<span class="token comment"># appendfsync no \u4E0D\u6267\u884C\u540C\u6B65\uFF0C\u64CD\u4F5C\u7CFB\u7EDF\u81EA\u884C\u540C\u6B65</span>
<span class="token comment"># appendfsync always \u6BCF\u6B21\u4FEE\u6539\u90FD\u4F1A\u540C\u6B65</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div>`,20);function r(c,b){return l}var i=n(p,[["render",r],["__file","config.html.vue"]]);export{i as default};
