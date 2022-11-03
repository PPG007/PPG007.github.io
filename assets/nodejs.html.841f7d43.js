import{_ as n,e as s}from"./app.b1e8d3cf.js";const a={},e=s(`<h1 id="nodejs" tabindex="-1"><a class="header-anchor" href="#nodejs" aria-hidden="true">#</a> nodejs</h1><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># install nvm</span>
<span class="token function">curl</span> -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh <span class="token operator">|</span> <span class="token function">zsh</span>
<span class="token comment"># then restart shell session</span>
<span class="token comment"># install latest nodejs</span>
nvm <span class="token function">install</span> <span class="token function">node</span>
<span class="token comment"># config npm</span>
<span class="token function">npm</span> config <span class="token builtin class-name">set</span> registry http://registry.npmmirror.com
<span class="token function">npm</span> config <span class="token builtin class-name">set</span> disturl http://npmmirror.com/dist
<span class="token comment"># install yarn</span>
<span class="token function">npm</span> <span class="token function">install</span> --global <span class="token function">yarn</span>
<span class="token comment"># config yarn</span>
<span class="token function">yarn</span> config <span class="token builtin class-name">set</span> registry http://registry.npmmirror.com
<span class="token function">yarn</span> config <span class="token builtin class-name">set</span> disturl http://npmmirror.com/dist
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div>`,2);function t(p,l){return e}var r=n(a,[["render",t],["__file","nodejs.html.vue"]]);export{r as default};
