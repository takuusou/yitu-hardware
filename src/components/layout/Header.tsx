'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { LangText } from '@/components/ui/LangText'

const NAV_LINKS = [
  { href: '#industries', zh: '领域', en: 'Industries' },
  { href: '#craft', zh: '工艺', en: 'Craft' },
  { href: '#precision', zh: '精度', en: 'Precision' },
  { href: '#security', zh: '安全', en: 'Security' },
  { href: '#about', zh: '关于', en: 'About' },
]

export function Header() {
  const { lang, setLang } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const menuButton = menuButtonRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    menuRef.current?.querySelector('button')?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
      if (event.key !== 'Tab') return
      const buttons = menuRef.current?.querySelectorAll('button')
      if (!buttons?.length) return
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      menuButton?.focus()
    }
  }, [menuOpen])

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <header
        style={{
          position: 'fixed',
          inset: '0 0 auto 0',
          zIndex: 100,
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          border: 'none',
        }}
      >
        <nav
          id="site-nav"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            height: 54,
            padding: '0 40px',
            gap: 24,
            maxWidth: 'var(--maxw)',
            margin: '0 auto',
          }}
        >
          {/* 左：桌面导航链接 */}
          <div className="hide-mobile" style={{ display: 'flex', gap: 30 }}>
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="nav-link"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontFamily: "'Noto Sans SC', sans-serif",
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  padding: '6px 0',
                  transition: 'color 0.4s ease',
                }}
              >
                <LangText zh={l.zh} en={l.en} />
              </button>
            ))}
          </div>

          {/* 左：移动端汉堡 */}
          <div className="show-mobile" style={{ display: 'none' }}>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={lang === 'zh' ? '菜单' : 'Menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                width: 36,
                height: 36,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="hamburger-line"
                  style={{
                    width: 22,
                    height: 1,
                    display: 'block',
                    transition: 'background 0.4s ease',
                  }}
                />
              ))}
            </button>
          </div>

          {/* 中：Logo */}
          <button
            onClick={() => scrollTo('#hero')}
            aria-label="YITU Hardware"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              justifyContent: 'center',
            }}
          >
            {/* logo icon */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt=""
              aria-hidden="true"
              className="logo-img"
              style={{ width: 26, height: 26, display: 'block', flexShrink: 0, transition: 'filter 0.4s ease' }}
            />
            {/* wordmark */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/yitu-wordmark.svg"
              alt="YITU Hardware"
              className="logo-img logo-wordmark"
              style={{ height: 16, width: 178, display: 'block', transition: 'filter 0.4s ease' }}
            />
          </button>

          {/* 右：语言切换 + 联系按钮 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 20 }}>

            {/* 语言切换 */}
            <div
              style={{
                display: 'flex',
                gap: 6,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.14em',
                fontSize: 11,
                userSelect: 'none' as const,
              }}
            >
              <button
                onClick={() => setLang('zh')}
                className={lang === 'zh' ? 'lang-btn lang-active' : 'lang-btn'}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: lang === 'zh' ? '1px solid currentColor' : 'none',
                  cursor: 'pointer',
                  padding: '4px 2px',
                  fontFamily: 'inherit',
                  letterSpacing: 'inherit',
                  fontSize: 'inherit',
                  transition: 'color 0.4s ease',
                }}
              >
                中
              </button>
              <span className="lang-sep" style={{ lineHeight: '1.6' }}>/</span>
              <button
                onClick={() => setLang('en')}
                className={lang === 'en' ? 'lang-btn lang-active' : 'lang-btn'}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: lang === 'en' ? '1px solid currentColor' : 'none',
                  cursor: 'pointer',
                  padding: '4px 2px',
                  fontFamily: 'inherit',
                  letterSpacing: 'inherit',
                  fontSize: 'inherit',
                  transition: 'color 0.4s ease',
                }}
              >
                EN
              </button>
            </div>

            {/* 联系按钮 */}
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollTo('#contact') }}
              className="contact-btn hide-mobile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 18px',
                border: '1px solid var(--ink)',
                color: 'var(--ink)',
                background: 'transparent',
                textDecoration: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase' as const,
                borderRadius: 0,
                transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease',
              }}
            >
              <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
              <LangText zh="联系我们" en="Contact" />
            </a>
          </div>
        </nav>
      </header>

      {/* 移动端全屏菜单 */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-label={lang === 'zh' ? '网站导航' : 'Site navigation'}
        aria-modal={menuOpen ? true : undefined}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        style={{
          position: 'fixed',
          top: 60,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--bg)',
          zIndex: 80,
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .4s cubic-bezier(.2,.7,.2,1)',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          borderTop: '1px solid var(--line)',
        }}
      >
        {[...NAV_LINKS, { href: '#contact', zh: '联系我们', en: 'Contact' }].map((l) => (
          <button
            key={l.href}
            onClick={() => scrollTo(l.href)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: '1px solid var(--line-soft)',
              cursor: 'pointer',
              fontFamily: lang === 'en' ? "'Fraunces', serif" : "'Noto Serif SC', serif",
              fontSize: 24,
              color: 'var(--ink)',
              textAlign: 'left',
              padding: '14px 0',
              letterSpacing: '0.06em',
            }}
          >
            <LangText zh={l.zh} en={l.en} />
          </button>
        ))}
        <div
          style={{
            marginTop: 24,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: 'var(--ink-mute)',
            letterSpacing: '0.18em',
            lineHeight: 1.8,
          }}
        >
          YITU HARDWARE · EST. 2016
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (max-width: 768px) {
          .logo-wordmark { display: none !important; }
          #site-nav { padding: 0 16px !important; gap: 8px !important; }
        }

        /* ── Light 主题（默认） ── */
        .nav-link   { color: var(--ink-soft); }
        .lang-btn   { color: var(--ink-mute); }
        .lang-active{ color: var(--ink); }
        .lang-sep   { color: var(--ink-faint); }
        .hamburger-line { background: var(--ink); }

        /* ── Logo ── */
        .logo-img { filter: brightness(0); transition: filter 0.4s ease; }

        /* ── Hover ── */
        .nav-link:hover { color: var(--ink) !important; }
        .contact-btn:hover { background: var(--ink) !important; color: var(--bg) !important; border-color: var(--ink) !important; }

        /* ── Dark 主题（Precision 等深色板块） ── */
        body[data-nav-theme="dark"] .logo-img        { filter: brightness(0) invert(1) drop-shadow(0 1px 4px rgba(0,0,0,0.5)); }
        body[data-nav-theme="dark"] .nav-link        { color: rgba(255,255,255,0.96) !important; text-shadow: 0 1px 8px rgba(0,0,0,0.5); }
        body[data-nav-theme="dark"] .nav-link:hover  { color: #FFFFFF !important; }
        body[data-nav-theme="dark"] .lang-btn        { color: rgba(255,255,255,0.92) !important; text-shadow: 0 1px 6px rgba(0,0,0,0.5); }
        body[data-nav-theme="dark"] .lang-active     { color: #FFFFFF !important; }
        body[data-nav-theme="dark"] .lang-sep        { color: rgba(255,255,255,0.6) !important; }
        body[data-nav-theme="dark"] .hamburger-line  { background: #FFFFFF !important; }
        body[data-nav-theme="dark"] .contact-btn     { color: #FFFFFF !important; border-color: rgba(255,255,255,0.65) !important; background: rgba(0,0,0,0.28) !important; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        body[data-nav-theme="dark"] .contact-btn:hover { background: #FFFFFF !important; color: var(--ink) !important; border-color: #FFFFFF !important; backdrop-filter: none; -webkit-backdrop-filter: none; }

        /* ── Nav 下划线 ── */
        .nav-link::after { background: currentColor; }
      `}</style>
    </>
  )
}
