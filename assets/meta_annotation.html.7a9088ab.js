import{_ as n,e as a}from"./app.b1e8d3cf.js";const s={},p=a(`<h1 id="\u5143\u6CE8\u89E3" tabindex="-1"><a class="header-anchor" href="#\u5143\u6CE8\u89E3" aria-hidden="true">#</a> \u5143\u6CE8\u89E3</h1><p>\u5143\u6CE8\u89E3\u987E\u540D\u601D\u4E49\u6211\u4EEC\u53EF\u4EE5\u7406\u89E3\u4E3A\u6CE8\u89E3\u7684\u6CE8\u89E3\uFF0C\u5B83\u662F\u4F5C\u7528\u5728\u6CE8\u89E3\u4E2D\uFF0C\u65B9\u4FBF\u6211\u4EEC\u4F7F\u7528\u6CE8\u89E3\u5B9E\u73B0\u60F3\u8981\u7684\u529F\u80FD\u3002\u5143\u6CE8\u89E3\u5206\u522B\u6709 <code>@Retention</code>\u3001 <code>@Target</code>\u3001 <code>@Document</code>\u3001 <code>@Inherited</code> \u548C <code>@Repeatable</code>\uFF08JDK1.8 \u52A0\u5165\uFF09\u4E94\u79CD\u3002</p><h2 id="retention" tabindex="-1"><a class="header-anchor" href="#retention" aria-hidden="true">#</a> @Retention</h2><p>Retention \u82F1\u6587\u610F\u601D\u6709\u4FDD\u7559\u3001\u4FDD\u6301\u7684\u610F\u601D\uFF0C\u5B83\u8868\u793A\u6CE8\u89E3\u5B58\u5728\u9636\u6BB5\u662F\u4FDD\u7559\u5728\u6E90\u7801\uFF08\u7F16\u8BD1\u671F\uFF09\uFF0C\u5B57\u8282\u7801\uFF08\u7C7B\u52A0\u8F7D\uFF09\u6216\u8005\u8FD0\u884C\u671F\uFF08JVM \u4E2D\u8FD0\u884C\uFF09\u3002\u5728 <code>@Retention</code> \u6CE8\u89E3\u4E2D\u4F7F\u7528<strong>\u679A\u4E3E RetentionPolicy</strong>\u6765\u8868\u793A\u6CE8\u89E3\u4FDD\u7559\u65F6\u671F\u3002</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> 16582
 */</span>
<span class="token annotation punctuation">@Retention</span><span class="token punctuation">(</span><span class="token class-name">RetentionPolicy</span><span class="token punctuation">.</span>CLASS<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> annotation1<span class="token punctuation">{</span>
<span class="token comment">//    \u9ED8\u8BA4\u7684\u4FDD\u7559\u7B56\u7565\uFF0C\u6CE8\u89E3\u5728class\u5B57\u8282\u7801\u6587\u4EF6\u4E2D\u5B58\u5728\uFF0C\u4F46\u8FD0\u884C\u65F6\u65E0\u6CD5\u83B7\u5F97</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> 16582
 */</span>
<span class="token annotation punctuation">@Retention</span><span class="token punctuation">(</span><span class="token class-name">RetentionPolicy</span><span class="token punctuation">.</span>RUNTIME<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> annotation2<span class="token punctuation">{</span>
<span class="token comment">//    \u6CE8\u89E3\u4F1A\u5728class\u5B57\u8282\u7801\u6587\u4EF6\u4E2D\u5B58\u5728\uFF0C\u5728\u8FD0\u884C\u65F6\u53EF\u4EE5\u901A\u8FC7\u53CD\u5C04\u83B7\u53D6\u5230</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> 16582
 */</span>
<span class="token annotation punctuation">@Retention</span><span class="token punctuation">(</span><span class="token class-name">RetentionPolicy</span><span class="token punctuation">.</span>SOURCE<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> annotation3<span class="token punctuation">{</span>
    <span class="token comment">//\u6CE8\u89E3\u53EA\u5B58\u5728\u4E8E\u6E90\u7801\u4E2D\uFF0Cclass\u5B57\u8282\u7801\u6587\u4EF6\u4E2D\u4E0D\u5305\u542B</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><h2 id="target" tabindex="-1"><a class="header-anchor" href="#target" aria-hidden="true">#</a> @Target</h2><p>Target \u7684\u82F1\u6587\u610F\u601D\u662F\u76EE\u6807\uFF0C\u8FD9\u4E5F\u5F88\u5BB9\u6613\u7406\u89E3\uFF0C\u4F7F\u7528 <code>@Target</code> \u5143\u6CE8\u89E3\u8868\u793A\u6211\u4EEC\u7684\u6CE8\u89E3\u4F5C\u7528\u7684\u8303\u56F4\u5C31\u6BD4\u8F83\u5177\u4F53\u4E86\uFF0C\u53EF\u4EE5\u662F\u7C7B\uFF0C\u65B9\u6CD5\uFF0C\u65B9\u6CD5\u53C2\u6570\u53D8\u91CF\u7B49\uFF0C\u540C\u6837\u4E5F\u662F\u901A\u8FC7<strong>\u679A\u4E3E\u7C7B ElementType</strong>\u8868\u8FBE\u4F5C\u7528\u7C7B\u578B\u3002</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span>TYPE<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> annotation4<span class="token punctuation">{</span>
<span class="token comment">//    \u4F5C\u7528\u63A5\u53E3\u3001\u7C7B\u3001\u679A\u4E3E\u3001\u6CE8\u89E3</span>
<span class="token punctuation">}</span>

<span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span>FIELD<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> annotation5<span class="token punctuation">{</span>
<span class="token comment">//    \u4F5C\u7528\u5C5E\u6027\u5B57\u6BB5\u3001\u679A\u4E3E\u7684\u5E38\u91CF</span>
<span class="token punctuation">}</span>

<span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span>METHOD<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> annotation6<span class="token punctuation">{</span>
<span class="token comment">//    \u4F5C\u7528\u65B9\u6CD5</span>
<span class="token punctuation">}</span>

<span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span>PARAMETER<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> annotation7<span class="token punctuation">{</span>
<span class="token comment">//    \u4F5C\u7528\u65B9\u6CD5\u53C2\u6570</span>
<span class="token punctuation">}</span>

<span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span>CONSTRUCTOR<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> annotation8<span class="token punctuation">{</span>
<span class="token comment">//    \u4F5C\u7528\u6784\u9020\u51FD\u6570</span>
<span class="token punctuation">}</span>

<span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span>LOCAL_VARIABLE<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> annotation9<span class="token punctuation">{</span>
<span class="token comment">//    \u4F5C\u7528\u5C40\u90E8\u53D8\u91CF</span>
<span class="token punctuation">}</span>

<span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span>ANNOTATION_TYPE<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> annotation10<span class="token punctuation">{</span>
<span class="token comment">//    \u4F5C\u7528\u4E8E\u6CE8\u89E3</span>
<span class="token comment">//    @Retention\u6CE8\u89E3\u4E2D\u5C31\u4F7F\u7528\u8BE5\u5C5E\u6027</span>
<span class="token punctuation">}</span>

<span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span>PACKAGE<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> annotation11<span class="token punctuation">{</span>
<span class="token comment">//    \u4F5C\u7528\u4E8E\u5305</span>
<span class="token punctuation">}</span>

<span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span>TYPE_PARAMETER<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> annotation12<span class="token punctuation">{</span>
<span class="token comment">//    \u4F5C\u7528\u4E8E\u7C7B\u578B\u6CDB\u578B\uFF0C\u5373\u6CDB\u578B\u65B9\u6CD5\u3001\u6CDB\u578B\u7C7B\u3001\u6CDB\u578B\u63A5\u53E3 \uFF08jdk1.8\u52A0\u5165\uFF09</span>
<span class="token punctuation">}</span>

<span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span>TYPE_USE<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> annotation13<span class="token punctuation">{</span>
<span class="token comment">//    \u53EF\u4EE5\u7528\u4E8E\u6807\u6CE8\u4EFB\u610F\u7C7B\u578B\u9664\u4E86 class \uFF08jdk1.8\u52A0\u5165\uFF09</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br></div></div><h2 id="document" tabindex="-1"><a class="header-anchor" href="#document" aria-hidden="true">#</a> @Document</h2><p>Document\u7684\u82F1\u6587\u610F\u601D\u662F\u6587\u6863\u3002\u5B83\u7684\u4F5C\u7528\u662F\u80FD\u591F\u5C06\u6CE8\u89E3\u4E2D\u7684\u5143\u7D20\u5305\u542B\u5230 Javadoc \u4E2D\u53BB\u3002</p><h2 id="inherited" tabindex="-1"><a class="header-anchor" href="#inherited" aria-hidden="true">#</a> @Inherited</h2><p>Inherited \u7684\u82F1\u6587\u610F\u601D\u662F\u7EE7\u627F\uFF0C\u4F46\u662F\u8FD9\u4E2A\u7EE7\u627F\u548C\u6211\u4EEC\u5E73\u65F6\u7406\u89E3\u7684\u7EE7\u627F\u5927\u540C\u5C0F\u5F02\uFF0C\u4E00\u4E2A\u88AB <code>@Inherited</code> \u6CE8\u89E3\u4E86\u7684\u6CE8\u89E3\u4FEE\u9970\u4E86\u4E00\u4E2A\u7236\u7C7B\uFF0C\u5B83\u7684\u5B50\u7C7B\u4E5F\u4F1A\u7EE7\u627F\u7236\u7C7B\u7684\u6CE8\u89E3\u3002</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span>TYPE<span class="token punctuation">)</span>
<span class="token annotation punctuation">@Documented</span>
<span class="token annotation punctuation">@Retention</span><span class="token punctuation">(</span><span class="token class-name">RetentionPolicy</span><span class="token punctuation">.</span>RUNTIME<span class="token punctuation">)</span>
<span class="token annotation punctuation">@Inherited</span>
<span class="token annotation punctuation">@interface</span> <span class="token class-name">InheritedTest</span><span class="token punctuation">{</span>

<span class="token punctuation">}</span>

<span class="token annotation punctuation">@InheritedTest</span>
<span class="token keyword">class</span> <span class="token class-name">Father</span><span class="token punctuation">{</span>

<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Son</span> <span class="token keyword">extends</span> <span class="token class-name">Father</span><span class="token punctuation">{</span>

<span class="token punctuation">}</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MetaAnnotation</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Son</span><span class="token punctuation">&gt;</span></span> sonClass <span class="token operator">=</span> <span class="token class-name">Son</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">;</span>
        <span class="token class-name">Annotation</span><span class="token punctuation">[</span><span class="token punctuation">]</span> annotations <span class="token operator">=</span> sonClass<span class="token punctuation">.</span><span class="token function">getAnnotations</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Annotation</span> annotation <span class="token operator">:</span> annotations<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>annotation<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div><h2 id="repeatable" tabindex="-1"><a class="header-anchor" href="#repeatable" aria-hidden="true">#</a> @Repeatable</h2><p>Repeatable \u7684\u82F1\u6587\u610F\u601D\u662F\u53EF\u91CD\u590D\u7684\u3002\u987E\u540D\u601D\u4E49\u8BF4\u660E\u88AB\u8FD9\u4E2A\u5143\u6CE8\u89E3\u4FEE\u9970\u7684\u6CE8\u89E3\u53EF\u4EE5\u540C\u65F6\u4F5C\u7528\u4E00\u4E2A\u5BF9\u8C61\u591A\u6B21\uFF0C\u4F46\u662F\u6BCF\u6B21\u4F5C\u7528\u6CE8\u89E3\u53C8\u53EF\u4EE5\u4EE3\u8868\u4E0D\u540C\u7684\u542B\u4E49\u3002</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * \u4E00\u4E2A\u4EBA\u559C\u6B22\u73A9\u6E38\u620F\uFF0C\u4ED6\u559C\u6B22\u73A9\u82F1\u96C4\u8054\u76DF\uFF0C\u7EDD\u5730\u6C42\u751F\uFF0C\u6781\u54C1\u98DE\u8F66\uFF0C\u5C18\u57C34\u7B49\uFF0C
 * \u5219\u6211\u4EEC\u9700\u8981\u5B9A\u4E49\u4E00\u4E2A\u4EBA\u7684\u6CE8\u89E3\uFF0C
 * \u4ED6\u5C5E\u6027\u4EE3\u8868\u559C\u6B22\u73A9\u6E38\u620F\u96C6\u5408\uFF0C
 * \u4E00\u4E2A\u6E38\u620F\u6CE8\u89E3\uFF0C\u6E38\u620F\u5C5E\u6027\u4EE3\u8868\u6E38\u620F\u540D\u79F0
 * <span class="token keyword">@author</span> 16582*/</span>
<span class="token annotation punctuation">@Documented</span>
<span class="token annotation punctuation">@Retention</span><span class="token punctuation">(</span><span class="token class-name">RetentionPolicy</span><span class="token punctuation">.</span>RUNTIME<span class="token punctuation">)</span>
<span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span>TYPE<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> <span class="token class-name">People</span> <span class="token punctuation">{</span>
    <span class="token class-name">Game</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token doc-comment comment">/**\u6E38\u620F\u6CE8\u89E3
 * <span class="token keyword">@author</span> 16582*/</span>
<span class="token annotation punctuation">@Repeatable</span><span class="token punctuation">(</span><span class="token class-name">People</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Retention</span><span class="token punctuation">(</span><span class="token class-name">RetentionPolicy</span><span class="token punctuation">.</span>RUNTIME<span class="token punctuation">)</span>
<span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span>TYPE<span class="token punctuation">)</span>
<span class="token annotation punctuation">@interface</span> <span class="token class-name">Game</span> <span class="token punctuation">{</span>
    <span class="token class-name">String</span> <span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token doc-comment comment">/**\u73A9\u6E38\u620F\u7C7B*/</span>
<span class="token annotation punctuation">@Game</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;LOL&quot;</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Game</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;PUBG&quot;</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Game</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;NFS&quot;</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Game</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;Dirt4&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">class</span> <span class="token class-name">PlayGame</span> <span class="token punctuation">{</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div>`,16);function t(e,o){return p}var l=n(s,[["render",t],["__file","meta_annotation.html.vue"]]);export{l as default};
