# 图像标签

## 基础图像标签

- img：通过 loading 属性指定指定图片加载的行为。
  - auto：浏览器的默认行为。
  - lazy：启用懒加载。
  - eager：立即加载，无论它在页面那个位置。
- figure：图像区块，将图像和相关信息封装在一起。
- figcaption：figure 的可选子元素，表示图像的文本描述。

## 响应式图片

- img 标签：

  - srcset 属性，指定多张图像，适应不同像素密度的屏幕。

  ```html
  <img srcset="foo-320w.jpg, foo-480w.jpg 1.5x, foo-640w.jpg 2x" src="foo-640w.jpg" />
  ```

  - sizes 属性：显示不同大小的图像。必须与 srcset 属性搭配。

  ```html
  <img
    srcset="foo-160.jpg 160w, foo-320.jpg 320w, foo-640.jpg 640w, foo-1280.jpg 1280w"
    sizes="(max-width: 440px) 100vw,
          (max-width: 900px) 33vw,
          254px"
    src="foo-1280.jpg"
  />
  ```

- picture 标签：

  ```html
  <picture>
    <source
      srcset="homepage-person@desktop.png, homepage-person@desktop-2x.png 2x"
      media="(min-width: 990px)"
    />
    <source
      srcset="homepage-person@tablet.png, homepage-person@tablet-2x.png 2x"
      media="(min-width: 750px)"
    />
    <img
      srcset="homepage-person@mobile.png, homepage-person@mobile-2x.png 2x"
      alt="Shopify Merchant, Corrine Anestopoulos"
    />
  </picture>
  ```
