import{_ as n,e as s}from"./app.b1e8d3cf.js";const a={},e=s(`<h1 id="git" tabindex="-1"><a class="header-anchor" href="#git" aria-hidden="true">#</a> git</h1><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># install git</span>
<span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> git-all
<span class="token comment"># config git</span>
<span class="token function">git</span> config --global user.name <span class="token string">&quot;&lt;your name&gt;&quot;</span>
<span class="token function">git</span> config --global user.email <span class="token string">&quot;&lt;your email&gt;&quot;</span>
<span class="token function">git</span> config --global core.editor <span class="token string">&quot;vim&quot;</span>
<span class="token comment"># generate ssh key</span>
ssh-keygen -t ed25519 -C <span class="token string">&quot;&lt;your email&gt;&quot;</span>
<span class="token comment"># get the ssh key</span>
<span class="token function">cat</span> .ssh/id_ed25519.pub
<span class="token comment"># copy ssh key to github</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div>`,2);function t(l,c){return e}var o=n(a,[["render",t],["__file","git.html.vue"]]);export{o as default};
