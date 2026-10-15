# Cloudflare Pages 部署

本项目使用静态导出，不需要租服务器、Node 常驻进程、数据库或后台接口。

## 从 GitHub 发布

1. 使用已创建的公开仓库 [takuusou/yitu-hardware](https://github.com/takuusou/yitu-hardware)，确认 main 包含完整源码、public、锁文件和文档；不上传 node_modules、.next、out 或秘密文件。
2. 创建 Cloudflare Pages 项目，连接该仓库，发布分支选择 main。
3. 构建命令为 `npm run build`，输出目录为 `out`，项目根目录使用仓库根目录。
4. Node.js 使用当前 22 版本（至少 22.22.2）；本地 22.22.1 安装/构建通过，但现有间接依赖 mute-stream 有版本警告。网站无需业务环境变量或数据库连接。
5. 先测试 Cloudflare 提供的 pages.dev 地址，再正式绑定域名。

也可以在本机执行 npm ci 和 npm run build，通过 Pages Direct Upload 上传 out 文件夹。需要自动跟随 GitHub 提交部署时，优先从 Git 集成开始。

## 新域名

新域名由用户购买，当前未提供。选定后：

1. 把 src/app/layout.tsx 的 metadataBase 和 openGraph.url 更新为真实 HTTPS 域名。
2. 重新构建发布，避免分享图片仍指向旧地址。
3. 在 Pages 添加自定义域名，按控制台步骤配置 DNS。
4. 等待 HTTPS 生效，检查首页、图片、404 和分享信息；同时使用 www 和根域名时确定首选地址。

本轮没有购买域名、修改 DNS 或部署 Cloudflare，本地构建成功不表示公网已经上线。

## 发布验收

- [ ] pages.dev 和新域名能打开，HTTPS 正常。
- [ ] 图片、字体、JS/CSS 无 404，未知路径返回 404。
- [ ] 桌面 3D 可交互，离屏和切换标签页后暂停。
- [ ] 375px、768px 和桌面中英文没有裁切或导航重叠。
- [ ] 工艺点击 04 后继续滚动不跳回 01。
- [ ] 手机菜单、联系入口、Escape 和键盘操作正常。
- [ ] 询价打开客户邮箱，附件由客户添加；不把打开草稿当作发送成功。
- [ ] 真机 Safari / Android 和海外网络完成实际测试。

修改后重跑 lint、build 和 typecheck。Git 集成下推送 main 后检查 Cloudflare 构建与实际页面；保留已验证 Git 提交及 Cloudflare 部署记录用于回退。

网页动画和 3D 使用访客设备的 CPU/GPU/内存。增加服务器内存不会提高客户端 3D 帧率。Spline 仍是外部资源，不会因迁移 Cloudflare 自动变成本地场景。

参考 [Cloudflare 静态 Next.js 文档](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/) 和 [Pages 限制](https://developers.cloudflare.com/pages/platform/limits/)。
