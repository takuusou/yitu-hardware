# Cloudflare Workers 静态资源部署

本项目使用 Next.js 静态导出，通过 Cloudflare Workers 托管 `out/` 中的 HTML、CSS、JavaScript、图片与字体。没有 Worker 脚本入口，不需要常驻 Node 服务、后端或数据库。

## 当前配置

- Worker 名称：`yitu-hardware`
- 兼容日期：`2026-10-17`
- 静态资源目录：`./out`
- 未找到资源时：`404-page`，使用站点的 `404.html`
- 临时访问地址：https://yitu-hardware.fecilo.workers.dev
- 当前只启用 `workers_dev`；未配置 `main`、`routes` 或自定义域名。

配置保存在仓库根目录的 `wrangler.jsonc`。`.wrangler/`、`node_modules/`、`.next/` 和 `out/` 已被 Git 忽略。

## 构建与部署

使用 Node.js 22。首次安装依赖：

```bash
npm ci
```

构建命令：

```bash
npm run build
```

输出目录为 `out/`。部署命令：

```bash
npm run deploy
```

该命令依次执行 `npm run build && npx wrangler deploy`。Wrangler 没有作为项目依赖加入，依赖锁文件未修改。

部署需要已有 Cloudflare 授权。可用 `npx wrangler whoami` 检查；仅在授权失败或权限不足时执行 `npx wrangler login` 并完成浏览器授权。

## 本次验证

2026-10-17 使用 Node.js 22.22.1 和 Wrangler 4.151.1 完成部署。构建产生 892 个文件，无单文件超过 25 MiB。

| 请求 | 结果 |
| --- | --- |
| `/` | 200，`text/html` |
| `/_next/static/chunks/0ml52ihok.~2s.js` | 200，`text/javascript` |
| `/hero-mobile.webp` | 200，`image/webp` |
| `/this-page-does-not-exist` | 404，正文与本地 `out/404.html` 完全一致 |
| `/_not-found.html` | 跳转至 `/_not-found` 后 200，`text/html` |

以上响应正文均与对应的本地构建文件一致。线上浏览器视觉、真机、实际邮件发送和 Spline 性能未在本轮验收。

## 下一轮自定义域名

下一轮通过 Wrangler 路由条目的 `custom_domain: true` 绑定自定义域名，再核对 HTTPS 与分享信息。本轮没有绑定 `yituhardware.com`，没有修改 DNS，也没有修改 `src/app/layout.tsx` 中的 `metadataBase` 和 `openGraph.url`；两处仍为 `https://yituhardware.com`。
