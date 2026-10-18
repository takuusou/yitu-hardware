# Cloudflare Workers 静态资源部署

正式网址：[https://yituhardware.com](https://yituhardware.com)，于 2026-10-17 上线。

本项目使用 Next.js 静态导出，通过 Cloudflare Workers 托管 `out/` 中的 HTML、CSS、JavaScript、图片与字体。配置见根目录 `wrangler.jsonc`，没有 Worker 脚本入口，也不需要常驻 Node 服务、后端或数据库。原阿里云服务器（Nginx + PM2）已停用，原部署方式作废。

## 前置条件

1. 使用 Node.js 22，建议至少 22.22.2，以满足现有间接依赖的版本要求。
2. 在仓库根目录按锁文件安装依赖，不更换包管理器或更新锁文件：

   ```bash
   npm ci
   ```

3. 首次部署或登录失效时，完成 Wrangler 浏览器登录，再核对部署账号：

   ```bash
   npx wrangler login
   npx wrangler whoami
   ```

   确认登录账号与 `wrangler.jsonc` 中固定的部署账号一致；不一致时停止部署。登录信息由本机工具管理，不写入仓库或公开文档。

`.wrangler/`、`node_modules/`、`.next/` 和 `out/` 已被 Git 忽略。保留完整源码与锁文件，构建产物不能代替源码备份。

## 构建与部署

发布前检查：

```bash
npm run lint
npm run build
npm run typecheck
```

构建命令为 `npm run build`，输出目录为 `out/`。静态资源配置使用 `assets.directory: "./out"`，缺失页面使用 `not_found_handling: "404-page"` 和站点的 `404.html`。

确认要发布的源码和配置后执行：

```bash
npm run deploy
```

该命令依次执行 `npm run build && npx wrangler deploy`，会重新构建。Wrangler 没有作为项目依赖加入。记录部署输出的版本及对应 Git 提交，便于后续回滚；遇到错误或非预期交互时先停止并检查，不自动更改区域设置。

## 域名与跳转现状

- 主域名 `yituhardware.com` 已通过 Worker custom domain 绑定，配置见 `wrangler.jsonc`。
- `www.yituhardware.com` 通过 Cloudflare 重定向规则以 301 跳转到 `https://yituhardware.com`，保留原路径和查询参数。
- 已开启 Always Use HTTPS，HTTP 访问跳转到 HTTPS。
- `workers_dev` 为 `false`，workers.dev 预览地址已关闭。
- DNS 由 Cloudflare 托管。域名注册商正从阿里云转移至 Cloudflare Registrar，2026-10-17 提交，预计 2026-10-22 至 2026-10-24 完成；尚需确认转移结果。

当前部署使用已存在的域名绑定和区域规则，日常发布无需重新创建 DNS 或重定向规则。

## 上线后的验证

以下命令仅检查公开地址，不修改配置。HTTPS 检查保留默认的证书校验，不使用 `-k`。

```bash
curl -sI https://yituhardware.com/
curl -sI http://yituhardware.com/
curl -sIL http://yituhardware.com/
curl -sI https://www.yituhardware.com/
curl -sIL https://www.yituhardware.com/
curl -sI 'https://www.yituhardware.com/test?x=1'
curl -sIL 'https://www.yituhardware.com/test?x=1'
curl -sIL http://www.yituhardware.com/
curl -sI https://yituhardware.com/hero-mobile.webp
curl -sI https://yituhardware.com/this-page-does-not-exist
```

| 检查 | 预期结果 |
| --- | --- |
| HTTPS 主域名首页 | 200，Content-Type 为 text/html，证书校验通过 |
| HTTP 主域名 | 301 到 https://yituhardware.com/，最终 200 |
| HTTPS www 首页 | 301 到 https://yituhardware.com/，最终 200 |
| www 的 /test?x=1 | 301 到 https://yituhardware.com/test?x=1；保留路径和查询参数，目标页面不存在时最终 404 属正常情况 |
| HTTP www | 最终到 https://yituhardware.com/，返回 200 |
| hero-mobile.webp | 200，Content-Type 为 image/webp |
| 不存在的页面 | 404，不能返回首页的 200 |

可用 GET 请求进一步检查 404 正文确实为站点自己的错误页：

```bash
curl -sS https://yituhardware.com/this-page-does-not-exist
```

检查返回页面内容，并按需抽查当前构建产生的 JS、CSS 和字体资源。此前 HTTP、www 跳转链及 404 已验证；本次文档更新没有重新部署或重新执行线上验收。

手机端与桌面一致加载 3D；开启减少动态效果或加载失败时显示静态图 `hero-mobile.webp`。真机、海外网络、实际邮件发送及 Spline 性能仍需继续验收。

## 回滚

在仓库根目录核对当前部署账号及配置后，执行：

```bash
npx wrangler rollback
```

按命令提示确认目标历史版本，保留回滚输出，并重新执行上面的首页、资源、跳转链和 404 检查。该命令回滚已发布的 Worker 版本，不回退本地 Git 文件，也不回滚区域中的 DNS 或重定向设置。下一次部署前，应先确认源码对应希望发布的版本，避免重新发布出现问题的内容。

## 代理与 DNS 检查

本机代理会使普通 UDP DNS 查询返回 `198.18.x.x` 假地址，这是代理行为，不能据此认定公网 DNS 故障。核对 DNS 使用 TCP 或 DoH：

```bash
dig +tcp @1.1.1.1 yituhardware.com A +short
dig +tcp @1.1.1.1 www.yituhardware.com A +short
curl -sS -H 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query?name=yituhardware.com&type=A'
curl -sS -H 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query?name=www.yituhardware.com&type=A'
```

开启代理的记录会返回 Cloudflare 边缘 IP；以 TCP 或 DoH 结果配合 HTTPS 实际响应判断，不依赖某一组固定 IP。
