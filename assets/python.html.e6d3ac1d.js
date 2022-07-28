import{_ as n,e as s}from"./app.49cd7b53.js";const a={},e=s(`<h1 id="python" tabindex="-1"><a class="header-anchor" href="#python" aria-hidden="true">#</a> Python</h1><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">sudo</span> <span class="token function">apt-get</span> update
<span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token function">install</span> software-properties-common
<span class="token function">sudo</span> add-apt-repository ppa:deadsnakes/ppa
<span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token function">install</span> python3.7
<span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token function">install</span> python3-venv
<span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> python3-pip
<span class="token comment"># then config pip</span>
<span class="token function">mkdir</span> ~/.pip
<span class="token function">vim</span> ~/.pip/pip.conf
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>add this to pip.conf:</p><div class="language-conf ext-conf line-numbers-mode"><pre class="language-conf"><code>[global]
index-url=http://mirrors.aliyun.com/pypi/simple/
[install]
trusted-host=mirrors.aliyun.com
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div>`,4);function p(t,o){return e}var i=n(a,[["render",p],["__file","python.html.vue"]]);export{i as default};
