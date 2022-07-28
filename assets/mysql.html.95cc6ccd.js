import{_ as e,r as t,o,c as l,a as n,d as c,F as r,b as s,e as p}from"./app.49cd7b53.js";const i={},m=n("h1",{id:"mysql",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#mysql","aria-hidden":"true"},"#"),s(" MySQL")],-1),u={href:"https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04",target:"_blank",rel:"noopener noreferrer"},b=s("install mysql on ubuntu20.04"),d=s("\u3002"),k=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># isntall mysql</span>
<span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> mysql-server
<span class="token comment"># run security script and config root user</span>
<span class="token function">sudo</span> mysql_secure_installation
<span class="token comment"># til now, command mysql must run with sudo, create a user to resolve this</span>
<span class="token comment"># first connect to mysql server with root</span>
<span class="token comment"># create user</span>
CREATE <span class="token environment constant">USER</span> <span class="token string">&#39;koston&#39;</span>@<span class="token string">&#39;localhost&#39;</span> IDENTIFIED BY <span class="token string">&#39;koston.localhost&#39;</span><span class="token punctuation">;</span>
<span class="token comment"># grant all privileges</span>
GRANT ALL PRIVILEGES ON *.* TO <span class="token string">&#39;koston&#39;</span>@<span class="token string">&#39;localhost&#39;</span> WITH GRANT OPTION<span class="token punctuation">;</span>
<span class="token comment"># flush</span>
FLUSH PRIVILEGES<span class="token punctuation">;</span>
<span class="token comment"># exit</span>
<span class="token builtin class-name">exit</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div>`,1);function h(_,f){const a=t("ExternalLinkIcon");return o(),l(r,null,[m,n("p",null,[n("a",u,[b,c(a)]),d]),k],64)}var y=e(i,[["render",h],["__file","mysql.html.vue"]]);export{y as default};
