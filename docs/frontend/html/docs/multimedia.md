# 多媒体标签

- video：视频。
- audio：音频。
- track：指定视频的字幕，格式是 WebVTT（`.vtt` 文件）。
  - label 属性：播放器显示的字幕名称。
  - kind 属性：字幕类型。
  - srclang 属性：字幕的语言。
  - default 属性：是否默认打开。
- source：用于 `<picture>`、`<video>`、`<audio>` 的内部，用于指定一项外部资源。
- embed：用于嵌入外部内容。
- object：插入外部资源，embed 的替代品。
