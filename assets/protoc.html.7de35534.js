import{_ as n,e as s}from"./app.b1e8d3cf.js";const a={},e=s(`<h1 id="protoc" tabindex="-1"><a class="header-anchor" href="#protoc" aria-hidden="true">#</a> protoc</h1><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># install protoc and go plugins</span>
<span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token function">install</span> protobuf-compiler
go <span class="token function">install</span> google.golang.org/protobuf/cmd/protoc-gen-go@latest
go <span class="token function">install</span> google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
go <span class="token function">install</span> github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest
go <span class="token function">install</span> github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div>`,2);function o(t,c){return e}var r=n(a,[["render",o],["__file","protoc.html.vue"]]);export{r as default};
