import{_ as e,r as t,o,c as p,a as n,d as c,F as l,b as s,e as i}from"./app.49cd7b53.js";const u={},r=n("h1",{id:"sogou-input",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#sogou-input","aria-hidden":"true"},"#"),s(" sogou input")],-1),m={href:"https://pinyin.sogou.com/linux/help.php",target:"_blank",rel:"noopener noreferrer"},b=s("sogou input"),d=s("\u3002"),k=i(`<p>Ubuntu20.04 should download the version higher than 2.3</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># update apt</span>
<span class="token function">sudo</span> <span class="token function">apt-get</span> update
<span class="token comment"># install fcitx</span>
<span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> fcitx
<span class="token comment"># config fcitx as system input</span>
<span class="token comment"># then make fcitx start with system</span>
<span class="token function">sudo</span> <span class="token function">cp</span> /usr/share/applications/fcitx.desktop /etc/xdg/autostart/
<span class="token comment"># remove ibus</span>
<span class="token function">sudo</span> <span class="token function">apt</span> purge ibus
<span class="token comment"># install sogou input fron deb package</span>
<span class="token comment"># then resolve dependencies</span>
<span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> libqt5qml5 libqt5quick5 libqt5quickwidgets5 qml-module-qtquick2
<span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> libgsettings-qt1
<span class="token comment"># then reboot ubuntu</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div>`,2);function f(h,_){const a=t("ExternalLinkIcon");return o(),p(l,null,[r,n("p",null,[n("a",m,[b,c(a)]),d]),k],64)}var x=e(u,[["render",f],["__file","sogou_input.html.vue"]]);export{x as default};
