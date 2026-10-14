# YITU Hardware · 怡途五金

![YITU Hardware brand preview](public/og-image.jpg)

A bilingual precision-manufacturing website built with Next.js, React, TypeScript, Spline and GSAP. Static HTML, CSS and JavaScript are generated for Cloudflare Pages. No application server, database or upload service is required.

中英文精密 CNC 企业展示网站，展示服务行业、工艺和合作流程，让客户通过自己的邮箱发送询价。项目由用户主导业务、内容和设计决策，与 AI 协作开发。

**Status:** static build, TypeScript and ESLint checks pass. Cloudflare production hosting and the new domain are not configured yet. Latest browser regression remains pending; see [verification notes](PRELAUNCH-REVIEW.md).

## Features

- Desktop Spline Hero; small screens and reduced-motion mode use an image.
- Scroll-driven upward text mask. 3D pauses offscreen and when the document is hidden.
- Responsive GSAP introduction and local WebP industry images.
- Craft steps share click/scroll position and use crossfades without blur.
- Keyboard-accessible mobile menu and capability accordion.
- Chinese / English switching with Zustand; defaults to Chinese, without refresh persistence.
- Quote form opens a mailto draft. Customers attach drawings and send the email themselves.
- Local fonts, Open Graph image and Twitter large-image metadata.

## Stack

| Area | Technology |
| --- | --- |
| Application | Next.js 16 App Router, React 19, TypeScript |
| Styling | CSS, inline component styles, Tailwind CSS 4 |
| Motion | GSAP / ScrollTrigger, CSS transitions |
| 3D | Spline React integration and runtime |
| Language | Zustand |
| Fonts | Noto Serif SC, Noto Sans SC, Fraunces, JetBrains Mono via installed Fontsource packages |
| Hosting | Next.js static export for Cloudflare Pages |

## Local development

Use Node.js 22. The release was built with Node.js 22.22.1; package-lock.json records the dependencies.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. If occupied, use `npm run dev -- --port 3002`.

## Checks and build

```bash
npm run lint
npm run build
npm run typecheck
```

Build output is `out/`. An optional static preview is:

```bash
python3 -m http.server 3001 --bind 127.0.0.1 --directory out
```

Open http://127.0.0.1:3001 and stop with Ctrl+C. Python is a local preview tool, not a website dependency. There is no Node-server `npm start` command for this static site.

## Structure

```text
src/app/                  Page, metadata and global styles
src/components/layout/    Header and footer
src/components/sections/  Hero, industries, craft and contact
src/components/ui/        Shared headings and language text
src/hooks/                Language state and reveal observer
public/                   Brand, photos, OG and local assets
next.config.ts            Static-export configuration
eslint.config.mjs         Next.js and TypeScript lint configuration
```

Commit source, public, configuration, lock file and documentation. Do not commit node_modules, .next, out, environment files, caches or credentials; .gitignore covers these. `private: true` in package.json prevents accidental npm publication and does not make GitHub private.

## Documentation

- [Cloudflare deployment](DEPLOYMENT.md)
- [Project goals and AI handoff](PROJECT.md)
- [Release verification](PRELAUNCH-REVIEW.md)

Before using a new domain, replace metadataBase and openGraph.url in src/app/layout.tsx. Their current value is the previously provided address, not evidence of a live deployment. The application requires no business environment variables or secrets.

## External resources and rights

The desktop scene loads from prod.spline.design. Hosting the page does not guarantee Spline availability or WebGL performance on every device. Fonts and images are local. Scene-load failure shows an image, a visible error and a retry button.

Brand assets and company copy belong to this project. Public visibility is not a blanket license to reuse trademarks or third-party assets. Dependency/font licenses remain those of their packages; no project-wide open-source license has been selected.
