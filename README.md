## alfred chrome bookmark

http://www.packal.org/workflow/chrome-bookmarks-0 这个workflow已经做得很好了。
为什么不直接使用这个workflow呢?

主要的y原因在于不支持中文拼音。

这个workflow的搜索是基于英文字符串的匹配, 如果chrome的书签中包含有中文, 想要通过拼音来匹配是不可能的。

所以实现了这个workflow。

## 要求
由于插件是使用`JavaScript`编写的, 所以在使用的时候需要安装`nodejs`
安装方法:
```sh
brew install nodejs
```

## 使用到的npm包
- [pinyin](https://github.com/hotoo/pinyin) # 用于将汉字转化成拼音, 以便后续进行匹配
- [fuse.js](https://github.com/krisk/Fuse) # 用于进行字符串的匹配
- [alfy](https://github.com/sindresorhus/alfy) # 这个其实没有什么用, 后续会删除