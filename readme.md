# koishi-plugin-iframe

[![npm](https://img.shields.io/npm/v/koishi-plugin-iframe?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-iframe)

Add more pages to the console!

为你的控制台添加更多页面！

## 使用示例

```yaml
plugins:
  iframe:
    routes:
      - name: 文档
        path: /docs
        link: https://koishi.chat
```

## 配置项

### routes[].name

- 类型: `string`

页面标题。

### routes[].path

- 类型: `string`

页面所占据的路由。

### routes[].link

- 类型: `string`

页面要访问的网络链接。
