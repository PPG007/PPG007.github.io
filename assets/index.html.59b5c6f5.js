import{_ as p,r as t,o as l,c,a as n,d as e,F as o,b as s,e as r}from"./app.b1e8d3cf.js";const i={},u=n("h1",{id:"docker",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#docker","aria-hidden":"true"},"#"),s(" Docker")],-1),k={href:"https://docs.docker.com/",target:"_blank",rel:"noopener noreferrer"},b=s("Docker\u6587\u6863"),m={href:"https://hub.docker.com/",target:"_blank",rel:"noopener noreferrer"},d=s("DockerHub\u4ED3\u5E93"),y={href:"https://vuepress.mirror.docker-practice.com/",target:"_blank",rel:"noopener noreferrer"},g=s("Docker \u4ECE\u5165\u95E8\u5230\u5B9E\u8DF5"),v={href:"https://github.com/phusion/baseimage-docker/blob/master/README_ZH_cn_.md",target:"_blank",rel:"noopener noreferrer"},_=s("Ubuntu \u57FA\u7840\u955C\u50CF"),h=r(`<p>\u57FA\u4E8E Ubuntu \u57FA\u7840\u955C\u50CF\u6784\u5EFA MySQL \u7684 Dockerfile\uFF1A</p><div class="language-docker ext-docker line-numbers-mode"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">FROM</span> phusion/baseimage:master</span>

<span class="token instruction"><span class="token keyword">ENV</span> HOME /root</span>
<span class="token instruction"><span class="token keyword">ENV</span> MYSQL_USERNAME root</span>
<span class="token instruction"><span class="token keyword">ENV</span> MYSQL_PASSWORD 123456</span>
<span class="token instruction"><span class="token keyword">ENV</span> MYSQL_DB_NAME my_db</span>

<span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">&quot;/sbin/my_init&quot;</span>]</span>
<span class="token instruction"><span class="token keyword">RUN</span> apt-get update &amp;&amp; <span class="token operator">\\</span>
    apt-get -y install mysql-server</span>
<span class="token instruction"><span class="token keyword">EXPOSE</span> 3306</span>
<span class="token comment"># \u5728\u57FA\u7840\u955C\u50CF /etc/my_init.d/ \u4E2D\u7684\u811A\u672C\u4F1A\u5728\u5BB9\u5668\u542F\u52A8\u65F6\u6267\u884C</span>
<span class="token instruction"><span class="token keyword">COPY</span> ./my_init.d/start_mysql.sh /etc/my_init.d/start_mysql.sh</span>
<span class="token instruction"><span class="token keyword">RUN</span> apt-get clean &amp;&amp; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>\u542F\u52A8\u811A\u672C\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>
<span class="token function">sed</span> -i <span class="token string">&#39;s/127.0.0.1/0.0.0.0/&#39;</span> /etc/mysql/mysql.conf.d/mysqld.cnf
<span class="token function">service</span> mysql start
mysql -uroot -e <span class="token string">&quot;CREATE USER &#39;<span class="token variable">\${MYSQL_USERNAME}</span>&#39;@&#39;%&#39; IDENTIFIED BY &#39;<span class="token variable">\${MYSQL_PASSWORD}</span>&#39;;&quot;</span>
mysql -uroot -e <span class="token string">&quot;GRANT ALL PRIVILEGES ON *.* TO &#39;<span class="token variable">\${MYSQL_USERNAME}</span>&#39;@&#39;%&#39; WITH GRANT OPTION;&quot;</span>
mysql -uroot -e <span class="token string">&quot;CREATE DATABASE <span class="token variable">\${MYSQL_DB_NAME}</span>;&quot;</span>
<span class="token function">service</span> mysql restart
/bin/bash
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>\u57FA\u4E8E Ubuntu \u57FA\u7840\u955C\u50CF\u6784\u5EFA PHP \u7684 Dockerfile\uFF1A</p><div class="language-docker ext-docker line-numbers-mode"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">FROM</span> phusion/baseimage:master</span>

<span class="token instruction"><span class="token keyword">ENV</span> HOME /root</span>

<span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">&quot;/sbin/my_init&quot;</span>]</span>
<span class="token instruction"><span class="token keyword">RUN</span> apt-add-repository ppa:ondrej/php &amp;&amp; <span class="token operator">\\</span>
    apt-get update &amp;&amp; <span class="token operator">\\</span>
    apt-get install -y php7.0 &amp;&amp; <span class="token operator">\\</span>
    apt-get install -y php7.0-mysql &amp;&amp; <span class="token operator">\\</span>
    apt-get install -y php7.0-fpm &amp;&amp; <span class="token operator">\\</span>
    apt-get install -y php7.0-gd</span>
<span class="token instruction"><span class="token keyword">COPY</span> my_init.d/start_php.sh /etc/my_init.d/start_php.sh</span>
<span class="token instruction"><span class="token keyword">EXPOSE</span> 9000</span>
<span class="token instruction"><span class="token keyword">RUN</span> apt-get clean &amp;&amp; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>\u542F\u52A8\u811A\u672C\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>
<span class="token function">service</span> php7.0-fpm start
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>\u57FA\u4E8E Ubuntu \u57FA\u7840\u955C\u50CF\u6784\u5EFA Nginx \u7684 Dockerfile\uFF1A</p><div class="language-docker ext-docker line-numbers-mode"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">FROM</span> phusion/baseimage:master</span>

<span class="token instruction"><span class="token keyword">ENV</span> HOME /root</span>
<span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">&quot;/sbin/my_init&quot;</span>]</span>
<span class="token instruction"><span class="token keyword">RUN</span> apt-get update &amp;&amp; <span class="token operator">\\</span>
    apt-get install -y nginx</span>
<span class="token instruction"><span class="token keyword">COPY</span> my_init.d/start_nginx.sh /etc/my_init.d/start_nginx.sh</span>
<span class="token instruction"><span class="token keyword">EXPOSE</span> 80</span>
<span class="token instruction"><span class="token keyword">RUN</span> apt-get clean &amp;&amp; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>\u542F\u52A8\u811A\u672C\uFF1A</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token shebang important">#!/bin/sh</span>
<span class="token function">service</span> nginx start
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>\u4F7F\u7528 Ubuntu \u57FA\u7840\u955C\u50CF\u6784\u5EFA Nginx\uFF0CPHP\uFF0CMySQL \u955C\u50CF\uFF0C\u5E76\u4F7F\u7528 Docker-Compose \u6784\u5EFA\u4E00\u4E2A WordPress \u7AD9\u70B9\u7684 <code>docker-compose.yml</code>\uFF1A</p><div class="language-yaml ext-yml line-numbers-mode"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&#39;3&#39;</span>
<span class="token key atrule">services</span><span class="token punctuation">:</span>
  <span class="token key atrule">mysql</span><span class="token punctuation">:</span>
    <span class="token key atrule">build</span><span class="token punctuation">:</span>
      <span class="token key atrule">context</span><span class="token punctuation">:</span> ./MySQL
      <span class="token key atrule">dockerfile</span><span class="token punctuation">:</span> Dockerfile
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token key atrule">MYSQL_DB_NAME</span><span class="token punctuation">:</span> wordpress
      <span class="token key atrule">MYSQL_USERNAME</span><span class="token punctuation">:</span> root
      <span class="token key atrule">MYSQL_PASSWORD</span><span class="token punctuation">:</span> <span class="token number">123456</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;3306:3306&quot;</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ./MySQL/conf/my.cnf<span class="token punctuation">:</span>/etc/mysql/my.cnf<span class="token punctuation">:</span>ro <span class="token comment"># \u6302\u8F7D\u914D\u7F6E\u6587\u4EF6\uFF0C\u5141\u8BB8\u7B80\u5355\u5BC6\u7801\u3002</span>
  <span class="token key atrule">php</span><span class="token punctuation">:</span>
    <span class="token key atrule">build</span><span class="token punctuation">:</span>
      <span class="token key atrule">context</span><span class="token punctuation">:</span> ./PHP
      <span class="token key atrule">dockerfile</span><span class="token punctuation">:</span> Dockerfile
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;9000:9000&quot;</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ~/playground/wordpress<span class="token punctuation">:</span>/var/www/html <span class="token comment"># \u6302\u8F7D WordPress \u9759\u6001\u6587\u4EF6</span>
      <span class="token punctuation">-</span> ./PHP/conf/www.conf<span class="token punctuation">:</span>/etc/php/7.0/fpm/pool.d/www.conf<span class="token punctuation">:</span>ro <span class="token comment"># \u6302\u8F7D php-fpm \u914D\u7F6E\u6587\u4EF6\u3002</span>
  <span class="token key atrule">nginx</span><span class="token punctuation">:</span>
    <span class="token key atrule">build</span><span class="token punctuation">:</span>
      <span class="token key atrule">context</span><span class="token punctuation">:</span> ./Nginx
      <span class="token key atrule">dockerfile</span><span class="token punctuation">:</span> Dockerfile
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;80:80&quot;</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ./Nginx/conf/nginx.conf<span class="token punctuation">:</span>/etc/nginx/nginx.conf<span class="token punctuation">:</span>ro <span class="token comment"># \u6302\u8F7D Nginx \u914D\u7F6E\u6587\u4EF6\u3002</span>
    <span class="token key atrule">volumes_from</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> php <span class="token comment"># \u5171\u4EAB PHP \u7684\u6570\u636E\u5377\u3002</span>
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> php
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br></div></div><p>MySQL \u914D\u7F6E\u6587\u4EF6\uFF1A</p><div class="language-cnf ext-cnf line-numbers-mode"><pre class="language-cnf"><code>[mysqld]
default_authentication_plugin= mysql_native_password
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>Nginx \u914D\u7F6E\u6587\u4EF6\uFF1A</p><div class="language-nginx ext-nginx line-numbers-mode"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">user</span> root</span><span class="token punctuation">;</span>
<span class="token directive"><span class="token keyword">worker_processes</span> auto</span><span class="token punctuation">;</span>
<span class="token directive"><span class="token keyword">error_log</span> /var/log/nginx/error.log</span><span class="token punctuation">;</span>
<span class="token directive"><span class="token keyword">pid</span> /run/nginx.pid</span><span class="token punctuation">;</span>
<span class="token directive"><span class="token keyword">include</span> /usr/share/nginx/modules/*.conf</span><span class="token punctuation">;</span>
<span class="token directive"><span class="token keyword">events</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">worker_connections</span> <span class="token number">1024</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token directive"><span class="token keyword">http</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">log_format</span>  main  <span class="token string">&#39;<span class="token variable">$remote_addr</span> - <span class="token variable">$remote_user</span> [<span class="token variable">$time_local]</span> &quot;<span class="token variable">$request</span>&quot; &#39;</span>
                      <span class="token string">&#39;<span class="token variable">$status</span> <span class="token variable">$body_bytes_sent</span> &quot;<span class="token variable">$http_referer</span>&quot; &#39;</span>
                      <span class="token string">&#39;&quot;<span class="token variable">$http_user_agent</span>&quot; &quot;<span class="token variable">$http_x_forwarded_for</span>&quot;&#39;</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">access_log</span>  /var/log/nginx/access.log  main</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">sendfile</span>            <span class="token boolean">on</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">tcp_nopush</span>          <span class="token boolean">on</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">tcp_nodelay</span>         <span class="token boolean">on</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">keepalive_timeout</span>   <span class="token number">65</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">types_hash_max_size</span> <span class="token number">4096</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">include</span>             /etc/nginx/mime.types</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">default_type</span>        application/octet-stream</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">include</span> /etc/nginx/conf.d/*.conf</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">listen</span>       <span class="token number">80</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">listen</span>       [::]:80</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">server_name</span>  _</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">root</span>         	/var/www/html</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">index</span> index.php</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">include</span> /etc/nginx/default.d/*.conf</span><span class="token punctuation">;</span>
	      <span class="token directive"><span class="token keyword">location</span> ~ .php$</span> <span class="token punctuation">{</span>
          <span class="token directive"><span class="token keyword">fastcgi_index</span> index.php</span><span class="token punctuation">;</span>
          <span class="token directive"><span class="token keyword">fastcgi_pass</span> php:9000</span><span class="token punctuation">;</span>
          <span class="token directive"><span class="token keyword">fastcgi_param</span> SCRIPT_FILENAME <span class="token variable">$document_root</span><span class="token variable">$fastcgi_script_name</span></span><span class="token punctuation">;</span>
          <span class="token directive"><span class="token keyword">fastcgi_param</span> PATH_INFO <span class="token variable">$fastcgi_path_info</span></span><span class="token punctuation">;</span>
          <span class="token directive"><span class="token keyword">fastcgi_intercept_errors</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>
          <span class="token directive"><span class="token keyword">include</span> fastcgi_params</span><span class="token punctuation">;</span>
	      <span class="token punctuation">}</span>
        <span class="token directive"><span class="token keyword">error_log</span>    /usr/error_www.abc.com.log    error</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br></div></div><p>PHP-FPM \u914D\u7F6E\u6587\u4EF6\uFF0C\u53EA\u4FEE\u6539 listen \u5C5E\u6027\u503C\u5373\u53EF\uFF0C\u8981\u548C Nginx \u7684\u4E0E PHP \u8FDE\u63A5\u7684\u914D\u7F6E\u76F8\u540C\uFF1A</p><div class="language-conf ext-conf line-numbers-mode"><pre class="language-conf"><code>listen = 9000
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div>`,20);function w(f,x){const a=t("ExternalLinkIcon");return l(),c(o,null,[u,n("p",null,[n("a",k,[b,e(a)])]),n("p",null,[n("a",m,[d,e(a)])]),n("p",null,[n("a",y,[g,e(a)])]),n("p",null,[n("a",v,[_,e(a)])]),h],64)}var E=p(i,[["render",w],["__file","index.html.vue"]]);export{E as default};
