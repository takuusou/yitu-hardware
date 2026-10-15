'use client'

import { useLang } from '@/hooks/useLang'
import { LangText } from '@/components/ui/LangText'

const NAV_LINKS = [
  { href: '#industries', zh: '领域', en: 'Industries' },
  { href: '#craft', zh: '工艺', en: 'Craft' },
  { href: '#precision', zh: '精度', en: 'Precision' },
  { href: '#security', zh: '安全', en: 'Security' },
  { href: '#about', zh: '关于我们', en: 'About' },
  { href: '#contact', zh: '联系我们', en: 'Contact' },
]

/* 十字准星位置（避开中央） */
const CROSSHAIRS: React.CSSProperties[] = [
  { top: '18%', left:  '6%' },
  { top: '22%', right: '8%' },
  { top: '68%', left: '14%' },
  { top: '72%', right: '5%' },
  { top: '45%', left: '42%', opacity: 0.15 }, /* 中偏左，更淡 */
  { top: '30%', right: '28%' },
]

function Crosshair({ style }: { style: React.CSSProperties }) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24" fill="none"
      style={{ position: 'absolute', pointerEvents: 'none', opacity: 0.28, ...style }}
    >
      <circle cx="12" cy="12" r="5" stroke="var(--line)" strokeWidth="1"/>
      <line x1="12" y1="0" x2="12" y2="7"  stroke="var(--line)" strokeWidth="1"/>
      <line x1="12" y1="17" x2="12" y2="24" stroke="var(--line)" strokeWidth="1"/>
      <line x1="0"  y1="12" x2="7"  y2="12" stroke="var(--line)" strokeWidth="1"/>
      <line x1="17" y1="12" x2="24" y2="12" stroke="var(--line)" strokeWidth="1"/>
    </svg>
  )
}

const h5Style: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  color: 'var(--ink-mute)',
  margin: '0 0 20px',
}

export function Footer() {
  const { lang } = useLang()

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer data-theme="light" style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--line)', overflow: 'hidden' }}>

      {/* ── 上半：装饰区 ── */}
      <div style={{ height: 280, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* 工程网格背景 */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 1,
          backgroundImage: 'linear-gradient(to right, rgba(26,28,30,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,28,30,0.07) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

        {/* 十字准星 */}
        {CROSSHAIRS.map((pos, i) => (
          <Crosshair key={i} style={{ ...pos, opacity: pos.opacity ?? 0.28 }} />
        ))}

        {/* 巨型标语 */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 'var(--maxw)', padding: '0 40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p className="footer-tagline" style={{
            fontFamily: lang === 'en' ? "'Fraunces', serif" : "var(--font-serif-display)",
            fontSize: 'clamp(40px, 5.5vw, 84px)',
            fontWeight: 300,
            lineHeight: 1.2,
            letterSpacing: lang === 'en' ? '-0.01em' : '0.18em',
            color: 'var(--ink)',
            margin: 0,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            userSelect: 'none',
          }}>
            <LangText zh="精微所向　　质坚如一" en="Precision Crafted · Built to Last" />
          </p>
        </div>
      </div>

      {/* ── 中间分隔线 ── */}
      <hr style={{ height: 1, background: 'var(--line)', border: 'none', margin: 0 }} />

      {/* ── 下半：信息区 ── */}
      <div className="footer-info-wrap" style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '60px 40px 40px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.2fr 1fr', gap: 56, marginBottom: 48 }}>

          {/* 栏1：品牌 */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/yitu-wordmark.svg" alt="YITU Hardware" style={{ display:'block', width:120, height:18, filter:'brightness(0)', marginBottom:16, objectFit:'contain' }} />
            <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 13, fontWeight: 400, color: 'var(--ink-soft)', lineHeight: 1.7, margin: '0 0 24px' }}>
              <LangText zh="怡途五金 · 精密机械加工" en="YITU Hardware · Precision Machining" />
            </p>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.22em', color: 'var(--ink-mute)' }}>
              <LangText zh="成立于 2016" en="EST. 2016" />
            </span>
          </div>

          {/* 栏2：导航 */}
          <div>
            <h5 style={h5Style}><LangText zh="导航" en="Navigation" /></h5>
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="foot-link"
                style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: "'Noto Sans SC', sans-serif", fontWeight: 400, color: 'var(--ink-soft)', textAlign: 'left', padding: 0, lineHeight: 2.2, transition: 'color .3s' }}
              >
                <LangText zh={l.zh} en={l.en} />
              </button>
            ))}
          </div>

          {/* 栏3：联系 */}
          <div>
            <h5 style={h5Style}><LangText zh="联系" en="Contact" /></h5>
            <p style={{ fontSize: 13, fontFamily: "'Noto Sans SC', sans-serif", color: 'var(--ink-soft)', margin: '0 0 12px', lineHeight: 1.7 }}>
              <LangText zh="广东省东莞市大朗镇大冚墟二街7号102室" en="Room 102, No.7 Dakeng St, Dalang, Dongguan, China" />
            </p>
            <p style={{ fontSize: 13, fontFamily: "'Noto Sans SC', sans-serif", color: 'var(--ink-soft)', margin: '0 0 8px', lineHeight: 1.7 }}>
              +86 186 8863 3958
            </p>
            <p style={{ fontSize: 13, fontFamily: "'Noto Sans SC', sans-serif", color: 'var(--ink-soft)', margin: '0 0 16px', lineHeight: 1.7 }}>
              rockkeatssss@gmail.com
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: 'var(--ink-mute)', margin: 0 }}>
              <LangText zh="周一至周六 9:00–18:00" en="MON–SAT 9:00–18:00 CST" />
            </p>
          </div>

          {/* 栏4：版权 & 备案 */}
          <div>
            <h5 style={h5Style}><LangText zh="版权信息" en="Legal" /></h5>
            <p style={{ fontSize: 13, fontFamily: "'Noto Sans SC', sans-serif", color: 'var(--ink-soft)', lineHeight: 1.7, margin: '0 0 16px' }}>
              <LangText zh="© 2026 东莞市怡途五金机械有限公司" en="© 2026 YITU Hardware Co., Ltd." />
            </p>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="foot-beian"
              style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.08em', color: 'var(--ink-mute)', textDecoration: 'none', marginBottom: 8, transition: 'color .3s' }}
            >
              粤ICP备2026062048号
            </a>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.32em', color: 'var(--ink-mute)', margin: '20px 0 0' }}>
              <LangText zh="中国 · 广东 · 东莞" en="DONGGUAN · GUANGDONG · CHINA" />
            </p>
          </div>
        </div>

        {/* 底部状态条 */}
        <div style={{ paddingTop: 24, borderTop: '1px solid var(--line-soft)', display: 'flex', justifyContent: 'center', gap: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.32em', color: 'var(--ink-mute)' }}>
          <LangText
            zh={<><span>怡途五金</span><span>·</span><span>成立于 2016</span><span>·</span><span>中国制造</span></>}
            en={<><span>YITU HARDWARE</span><span>·</span><span>EST. 2016</span><span>·</span><span>MADE IN CHINA</span></>}
          />
        </div>
      </div>

      <style>{`
        .foot-link:hover { color: var(--ink) !important; }
        .foot-beian:hover { color: var(--ink-soft) !important; }
        @media (max-width:1200px) { .footer-tagline { font-size: clamp(32px, 4.5vw, 60px) !important; } }
        @media (max-width:768px) {
          .footer-tagline { font-size: 16px !important; white-space: normal !important; line-height: 1.4 !important; text-align: center !important; }
          footer > div:first-child { height: auto !important; padding: 48px 20px !important; }
          footer > div:first-child > div:last-child { padding: 0 !important; }
          .footer-info-wrap { padding: 0 !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px 24px !important; padding: 40px 20px 28px !important; }
          footer .footer-info-wrap > div:last-child { padding: 16px 20px 20px !important; }
        }
        @media (max-width:480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .footer-grid > div { margin-bottom: 24px; }
        }
      `}</style>
    </footer>
  )
}
