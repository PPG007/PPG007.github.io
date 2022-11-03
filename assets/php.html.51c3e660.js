import{_ as t,r as l,o,c,a as s,d as e,F as i,b as n,e as p}from"./app.b1e8d3cf.js";const r={},u=s("h1",{id:"php",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#php","aria-hidden":"true"},"#"),n(" PHP")],-1),b=n("use "),h={href:"https://github.com/phpenv/phpenv",target:"_blank",rel:"noopener noreferrer"},m=n("phpenv"),d=n(" to manage php versions"),k=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">git</span> clone git@github.com:phpenv/phpenv.git ~/.phpenv
<span class="token builtin class-name">echo</span> <span class="token string">&#39;export PATH=&quot;$HOME/.phpenv/bin:$PATH&quot;&#39;</span> <span class="token operator">&gt;&gt;</span> ~/.zshrc <span class="token comment"># for zsh</span>
<span class="token builtin class-name">echo</span> <span class="token string">&#39;eval &quot;$(phpenv init -)&quot;&#39;</span> <span class="token operator">&gt;&gt;</span> ~/.zshrc <span class="token comment"># for zsh</span>
<span class="token comment"># restart shell</span>
<span class="token function">git</span> clone https://github.com/php-build/php-build <span class="token variable"><span class="token variable">$(</span>phpenv root<span class="token variable">)</span></span>/plugins/php-build
phpenv <span class="token function">install</span> <span class="token punctuation">[</span>any php version<span class="token punctuation">]</span> <span class="token comment"># eg: phpenv install 8.1.0</span>
phpenv rehash
phpenv global <span class="token number">8.1</span>.0
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div>`,1),v=n("Maybe there are several dependencies that your system not satisfied, just google. You can also try "),_={href:"https://github.com/phpenv/phpenv-installer",target:"_blank",rel:"noopener noreferrer"},g=n("phpenv-installer"),f=n("."),x=p(`<p>There are some, maybe you need install more:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token punctuation">\\</span>
	<span class="token function">install</span> <span class="token punctuation">\\</span>
	buildconf <span class="token punctuation">\\</span>
	autoconf <span class="token punctuation">\\</span>
	build-essential <span class="token punctuation">\\</span>
	bison <span class="token punctuation">\\</span>
	re2c <span class="token punctuation">\\</span>
	pkg-config <span class="token punctuation">\\</span>
	libxml2-dev <span class="token punctuation">\\</span>
	openssl <span class="token punctuation">\\</span>
	openssh-client <span class="token punctuation">\\</span>
	openssl <span class="token punctuation">\\</span>
	libssl-dev <span class="token punctuation">\\</span>
	sqlite3 <span class="token punctuation">\\</span>
	libsqlite3-dev <span class="token punctuation">\\</span>
	zlib1g-dev <span class="token punctuation">\\</span>
	libbz2-dev <span class="token punctuation">\\</span>
	libcurl4-openssl-dev <span class="token punctuation">\\</span>
	libpng-dev <span class="token punctuation">\\</span>
	libjpeg-dev
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div>`,2);function y(q,z){const a=l("ExternalLinkIcon");return o(),c(i,null,[u,s("p",null,[b,s("a",h,[m,e(a)]),d]),k,s("p",null,[v,s("a",_,[g,e(a)]),f]),x],64)}var H=t(r,[["render",y],["__file","php.html.vue"]]);export{H as default};
