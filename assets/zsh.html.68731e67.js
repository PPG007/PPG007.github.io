import{_ as s,e as n}from"./app.49cd7b53.js";const a={},e=n(`<h1 id="zsh-oh-my-zsh-terminator" tabindex="-1"><a class="header-anchor" href="#zsh-oh-my-zsh-terminator" aria-hidden="true">#</a> zsh&amp;oh-my-zsh&amp;terminator</h1><p>install zsh:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># install zsh</span>
<span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token function">install</span> <span class="token function">zsh</span>
<span class="token comment"># set zsh default shell,then logout</span>
chsh -s /usr/bin/zsh
<span class="token comment"># install curl</span>
<span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> <span class="token function">curl</span>
<span class="token comment"># or install wget to get oh-my-zsh</span>
<span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> <span class="token function">wget</span>
<span class="token comment"># install oh-my-zsh</span>
<span class="token function">sh</span> -c <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh<span class="token variable">)</span></span>&quot;</span>
<span class="token comment"># or</span>
<span class="token function">sh</span> -c <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token function">wget</span> https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -<span class="token variable">)</span></span>&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>install terminator:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># install terminator</span>
<span class="token function">sudo</span> add-apt-repository ppa:mattrose/terminator
<span class="token function">sudo</span> <span class="token function">apt-get</span> update
<span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> terminator
<span class="token comment"># set terminator default</span>
gsettings <span class="token builtin class-name">set</span> org.gnome.desktop.default-applications.terminal <span class="token builtin class-name">exec</span> /usr/bin/terminator
gsettings <span class="token builtin class-name">set</span> org.gnome.desktop.default-applications.terminal exec-arg <span class="token string">&quot;-x&quot;</span>
<span class="token comment"># maybe need this</span>
gsettings <span class="token builtin class-name">set</span> org.cinnamon.desktop.default-applications.terminal <span class="token builtin class-name">exec</span> /usr/bin/terminator
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>install zsh plugins:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># install zsh-syntax-highlighting</span>
<span class="token function">git</span> clone https://github.com/zsh-users/zsh-syntax-highlighting.git <span class="token variable">\${ZSH_CUSTOM<span class="token operator">:-</span>~<span class="token operator">/</span>.oh-my-zsh<span class="token operator">/</span>custom}</span>/plugins/zsh-syntax-highlighting
<span class="token comment"># install autosuggestions</span>
<span class="token function">git</span> clone https://github.com/zsh-users/zsh-autosuggestions <span class="token variable">\${ZSH_CUSTOM<span class="token operator">:-</span>~<span class="token operator">/</span>.oh-my-zsh<span class="token operator">/</span>custom}</span>/plugins/zsh-autosuggestions
<span class="token comment"># install git-open</span>
<span class="token function">git</span> clone https://github.com/paulirish/git-open.git <span class="token variable">$ZSH_CUSTOM</span>/plugins/git-open
<span class="token comment"># then vim ~/.zshrc</span>
<span class="token assign-left variable">plugins</span><span class="token operator">=</span><span class="token punctuation">(</span>git <span class="token function">sudo</span> zsh-syntax-highlighting zsh-autosuggestions colored-man-pages safe-paste git-open<span class="token punctuation">)</span>
<span class="token comment"># then</span>
<span class="token builtin class-name">source</span> ~/.zshrc
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div>`,7);function t(p,l){return e}var i=s(a,[["render",t],["__file","zsh.html.vue"]]);export{i as default};
