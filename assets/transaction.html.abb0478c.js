import{_ as s,e as n}from"./app.b1e8d3cf.js";const a={},e=n(`<h1 id="redis-\u64CD\u4F5C\u4E8B\u52A1" tabindex="-1"><a class="header-anchor" href="#redis-\u64CD\u4F5C\u4E8B\u52A1" aria-hidden="true">#</a> Redis \u64CD\u4F5C\u4E8B\u52A1</h1><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>redis \u5355\u6761\u547D\u4EE4\u4FDD\u8BC1\u539F\u5B50\u6027\u3002</p><p>\u4F46\u662F\u4E8B\u52A1\u4E0D\u4FDD\u8BC1\u539F\u5B50\u6027\u3002</p><p>\u4E00\u6B21\u6027\u3001\u987A\u5E8F\u6027\u3001\u6392\u4ED6\u6027\u3002</p></div><h2 id="redis-\u4E8B\u52A1\u9636\u6BB5" tabindex="-1"><a class="header-anchor" href="#redis-\u4E8B\u52A1\u9636\u6BB5" aria-hidden="true">#</a> Redis \u4E8B\u52A1\u9636\u6BB5</h2><ul><li>\u5F00\u542F\u4E8B\u52A1(MULTI)\u3002</li><li>\u547D\u4EE4\u5165\u961F\u3002</li><li>\u6267\u884C\u4E8B\u52A1(EXEC)\u3002</li></ul><h2 id="\u57FA\u7840\u547D\u4EE4" tabindex="-1"><a class="header-anchor" href="#\u57FA\u7840\u547D\u4EE4" aria-hidden="true">#</a> \u57FA\u7840\u547D\u4EE4</h2><p>\u521B\u5EFA\u4E8B\u52A1\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> multi
OK
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">set</span> key1 key1
QUEUED
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">set</span> key2 key2
QUEUED
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> get key1
QUEUED
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">set</span> key3 key3
QUEUED
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>\u6267\u884C\u4E8B\u52A1\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">exec</span>
<span class="token number">1</span><span class="token punctuation">)</span> OK
<span class="token number">2</span><span class="token punctuation">)</span> OK
<span class="token number">3</span><span class="token punctuation">)</span> <span class="token string">&quot;key1&quot;</span>
<span class="token number">4</span><span class="token punctuation">)</span> OK
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>\u53D6\u6D88\u4E8B\u52A1\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> multi
OK
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">set</span> a a
QUEUED
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> discard
OK
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> get a
<span class="token punctuation">(</span>nil<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h2 id="\u4E8B\u52A1\u4E2D\u7684\u5F02\u5E38" tabindex="-1"><a class="header-anchor" href="#\u4E8B\u52A1\u4E2D\u7684\u5F02\u5E38" aria-hidden="true">#</a> \u4E8B\u52A1\u4E2D\u7684\u5F02\u5E38</h2><p>\u8BED\u6CD5\u9519\u8BEF\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># \u6240\u6709\u547D\u4EE4\u90FD\u4E0D\u4F1A\u6267\u884C</span>
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> multi
OK
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">set</span> a a
QUEUED
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">set</span> b b
QUEUED
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> asfafargq
<span class="token punctuation">(</span>error<span class="token punctuation">)</span> ERR unknown <span class="token builtin class-name">command</span> <span class="token variable"><span class="token variable">\`</span>asfafargq<span class="token variable">\`</span></span>, with args beginning with:
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> getset c
<span class="token punctuation">(</span>error<span class="token punctuation">)</span> ERR wrong number of arguments <span class="token keyword">for</span> <span class="token string">&#39;getset&#39;</span> <span class="token builtin class-name">command</span>
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">set</span> d d
QUEUED
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">exec</span>
<span class="token punctuation">(</span>error<span class="token punctuation">)</span> EXECABORT Transaction discarded because of previous errors.
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> keys *
<span class="token punctuation">(</span>empty list or <span class="token builtin class-name">set</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p>\u64CD\u4F5C\u9519\u8BEF(\u8FD0\u884C\u65F6\u5F02\u5E38)\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># \u6B63\u5E38\u547D\u4EE4\u4F9D\u7136\u6B63\u5E38\u6267\u884C</span>
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> multi
OK
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> incr a
QUEUED
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">set</span> b b
QUEUED
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> get b
QUEUED
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">exec</span>
<span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> ERR value is not an integer or out of range
<span class="token number">2</span><span class="token punctuation">)</span> OK
<span class="token number">3</span><span class="token punctuation">)</span> <span class="token string">&quot;b&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><h2 id="\u4E50\u89C2\u9501" tabindex="-1"><a class="header-anchor" href="#\u4E50\u89C2\u9501" aria-hidden="true">#</a> \u4E50\u89C2\u9501</h2><p>\u901A\u8FC7 watch \u548C unwatch \u547D\u4EE4\u5F00\u542F/\u5173\u95ED\u5BF9 key \u7684\u76D1\u89C6\u3002</p><p>\u6B63\u5E38\u6267\u884C\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">set</span> money <span class="token number">100</span>
OK
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">set</span> out <span class="token number">0</span>
OK
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token function">watch</span> money
OK
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> multi
OK
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> decrby money <span class="token number">20</span>
QUEUED
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> incrby out <span class="token number">20</span>
QUEUED
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">exec</span>
<span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">80</span>
<span class="token number">2</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">20</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>\u5F02\u5E38\u6267\u884C\uFF1A</p><p>\u5BA2\u6237\u7AEF 1\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token function">watch</span> money out
OK
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> multi
OK
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> decrby money <span class="token number">5</span>
QUEUED
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> incrby out <span class="token number">5</span>
QUEUED
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>\u5BA2\u6237\u7AEF 1 \u7684\u4E8B\u52A1\u5148\u4E0D\u6267\u884C\uFF0C\u6B64\u65F6\u63D2\u5165\u5BA2\u6237\u7AEF 2 \u7684\u64CD\u4F5C\u3002</p><p>\u5BA2\u6237\u7AEF 2\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> decrby out <span class="token number">10</span>
<span class="token punctuation">(</span>integer<span class="token punctuation">)</span> <span class="token number">10</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>\u7136\u540E\u5BA2\u6237\u7AEF 1 \u518D\u6267\u884C\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">exec</span>
<span class="token punctuation">(</span>nil<span class="token punctuation">)</span>
<span class="token number">150.158</span>.153.216:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> get money
<span class="token string">&quot;80&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>\u4E8B\u52A1\u6CA1\u6709\u6267\u884C\u3002</p><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>\u5982\u679C\u5E0C\u671B\u518D\u6B21\u6267\u884C\u4E8B\u52A1\uFF0C\u5148\u7528 unwatch \u89E3\u9501\u518D\u4F7F\u7528 watch \u91CD\u65B0\u52A0\u9501\u3002</p></div>`,30);function p(t,r){return e}var c=s(a,[["render",p],["__file","transaction.html.vue"]]);export{c as default};
